import { Dayjs } from 'dayjs';
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
      const destinationCandidates = targetCountry.provinces.filter((p) =>
        p.isNextTo(division.at)
      );
      if (destinationCandidates.length === 0) return; //移動先候補が無ければ移動しない
      const targetProvince = Util.getRandom(destinationCandidates);
      division.setDestination(targetProvince);
    });
  }
}
