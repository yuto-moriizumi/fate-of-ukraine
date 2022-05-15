import * as PIXI from 'pixi.js';

export abstract class Scene extends PIXI.Container {
  elapsedFrameCount = 0;
  //GameManagerによって、requestAnimationFrame毎に呼び出されるメソッド
  public update(delta: number) {
    this.elapsedFrameCount++;
  }

  //UI Graph意外に利用するリソースがある場合に派生クラスで実装する
  //   protected createInitialResourceList(): (LoaderAddParam | string)[] {
  //     //リソースリスト取得
  //     return [];
  //   }

  //   public beginLoadResource(onLoaded: () => void): Promise<void> {
  //     //リソースダウンロードのフローを実行する
  //     return new Promise((resolve) => {
  //       this.loadInitialResource(() => resolve());
  //     })
  //       .then(() => {
  //         return new Promise((resolve) => {
  //           const additionalAssets = this.onInitialResourceLoaded();
  //           this.loadAdditionalResource(additionalAssets, () => resolve());
  //         });
  //       })
  //       .then(() => {
  //         this.onAdditionalResourceLoaded();
  //         onLoaded();
  //         this.onResourceLoaded();
  //       });
  //   }

  //最初に、UIGraph情報とcreateInitialResourceListで指定されたリソースをダウンロードする
  //   protected loadInitialResource(onLoaded: () => void): void {
  //     const assets = this.createInitialResourceList();
  //     GameManager.instance.game.loader
  //       .add(this.filterLoadedAssets(assets))
  //       .load(() => onLoaded());
  //   }

  //渡されたアセットのリストから、ロード済みのものをフィルタリングする
  //   private filterLoadedAssets(
  //     assets: (LoaderAddParam | string)[]
  //   ): LoaderAddParam[] {
  //     const assetMap = new Map<string, LoaderAddParam>();
  //     const loader = GameManager.instance.game.loader;
  //     for (const asset of assets) {
  //       if (typeof asset === 'string') {
  //         if (!loader.resources[asset] && !assetMap.has(asset)) {
  //           assetMap.set(asset, { name: asset, url: asset });
  //         }
  //       } else {
  //         if (!loader.resources[asset.name] && !assetMap.has(asset.name)) {
  //           assetMap.set(asset.name, asset);
  //         }
  //       }
  //     }
  //     return Array.from(assetMap.values());
  //   }

  //loadInitialResource完了時のコールバックメソッド
  //追加でロードしなければならないてくすちゃなどの情報を返す
  //   protected onInitialResourceLoaded(): string[] | LoaderAddParam[] {
  //     return [];
  //   }

  //onInitialResourceLoadedで発生した追加のリソースをロードする
  //   protected loadAdditionalResource(
  //     assets: string[] | LoaderAddParam[],
  //     onLoaded: () => void
  //   ): void {
  //     GameManager.instance.game.loader
  //       .add(this.filterLoadedAssets(assets))
  //       .load(() => onLoaded());
  //   }

  //追加のリソースロード完了時のコールバック 何もしない
  //   protected onAdditionalResourceLoaded(): void {}

  //すべてのリソースロード処理完了時のコールバック
  //   protected onResourceLoaded(): void {
  //     this.addChild(this.uiGraphContainer);
  //   }
}
