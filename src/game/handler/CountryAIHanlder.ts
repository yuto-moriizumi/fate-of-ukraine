import { Dayjs } from 'dayjs';
import { MOVE_TYPE } from '../data/DivisionMovement';
import { Province } from '../data/Provice';
import { InvisibleEvent } from '../event/InvisibleEvent';
import { VisibleEvent } from '../event/VisibleEvent';
import Util from '../util/Util';
import { CountryHandler } from './handlers';

export class CountryAIHandler extends CountryHandler {
  onEvent(event: VisibleEvent | InvisibleEvent) {
    //ランダムな選択肢を実行する
    if (event instanceof InvisibleEvent) return;
    if (event.options === undefined) return;
    const optionNumber = Util.getRandomInt(0, event.options.length - 1);
    event.options[optionNumber].takeEffects();
  }

  public update(date: Dayjs) {
    super.update(date);
    //師団の生産
    //維持コストの計算
    const balance = this.country.calcBalance();
    const maintanance = this.country.calcMaintanance();
    const expeditionRate = balance == 0 ? 1 : maintanance / balance;
    if (
      (this.country.hasWar() && expeditionRate < 0.8) ||
      expeditionRate < 0.2
    ) {
      //戦時中に支出割合が8割を超えていないか、2割を超えていない場合1師団生産
      this.country.buildDivision();
    }
    if (!this.country.hasWar()) return; //戦争していないならなにもしない
    //師団の移動
    const targetCountry = Util.getRandom(this.country.enemies);
    this.country.divisions.forEach((division) => {
      if (division.movement != undefined) return;
      //プロヴィンスに属していて、移動も戦闘もしていないならば、師団を動かす

      //BFSと経路復元で次の移動先を計算する
      const queue = [division.at];
      const distances = new Map<Province, number>();
      distances.set(division.at, 0);
      let destination: Province | undefined;
      while (queue.length > 0) {
        const p = queue.shift();
        if (p === undefined) break;
        if (p.owner === targetCountry) {
          destination = p;
          break;
        }
        const d = distances.get(p);
        if (d === undefined) continue;
        p.neighbors.forEach((p2) => {
          if (!division.owner.hasAccessTo(p2)) return;
          const d2 = distances.get(p2);
          if (d2 !== undefined) return;
          distances.set(p2, d + 1);
          queue.push(p2);
        });
      }
      if (destination === undefined) return;
      let nextProvince: Province | undefined;
      const queue2 = [destination];
      while (queue2.length > 0) {
        const p = queue2.shift();
        if (p === undefined) break;
        const next = p.neighbors
          .map((p2) => {
            const d = distances.get(p2);
            return { d: d === undefined ? 10 ** 9 : d, p: p2 };
          })
          .sort((a, b) => a.d - b.d)[0];
        if (next.p === division.at) {
          nextProvince = p;
          break;
        }
        queue2.push(next.p);
      }
      if (nextProvince === undefined) return;
      division.setDestination(nextProvince, MOVE_TYPE.MOVE);
    });
  }
}
