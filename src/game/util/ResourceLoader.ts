import { Loader, LoaderResource } from 'pixi.js';

export class ResourceLoader {
  constructor(private readonly loader: Loader) {
    this.loader = loader;
  }

  public load(url: string, onLoadEnd: (resource: LoaderResource) => void) {
    const resource = this.getResource(url);
    resource === undefined
      ? this.loader.add(url, () => onLoadEnd(this.getResource(url)))
      : onLoadEnd(resource);
  }

  private getResource(url: string) {
    return this.loader.resources[url];
  }
}
