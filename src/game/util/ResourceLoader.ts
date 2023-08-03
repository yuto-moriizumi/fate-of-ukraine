import { Loader, LoaderResource } from 'pixi.js';

export class ResourceLoader {
  constructor(public readonly loader: Loader) {
    this.loader = loader;
  }

  public load(url: string, onLoadEnd: (resource: LoaderResource) => void) {
    const resource = this.getResource(url);
    if (resource !== undefined) {
      onLoadEnd(resource);
      return;
    }
    const addResource = () =>
      this.loader.add(url, () => onLoadEnd(this.getResource(url)));
    if (this.loader.loading) {
      this.loader.onProgress.once(addResource);
    } else addResource();
  }

  private getResource(url: string) {
    return this.loader.resources[url];
  }
}
