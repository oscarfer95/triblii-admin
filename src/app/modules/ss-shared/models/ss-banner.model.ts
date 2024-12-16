export class SsBanner {
  public id?: string;
  public backgroundUrl: string;
  public buttonLabel: string;
  public buttonLink: string;
  public catalogueId: string;
  public description: string;
  public isSponsored: boolean;
  public pngUrl: string;
  public title: string;

  constructor() {
    this.id = '';
    this.catalogueId = '';
    this.backgroundUrl = '';
    this.description = '';
    this.buttonLabel = '';
    this.buttonLink = '';
    this.pngUrl = '';
    this.title = '';
    this.isSponsored = false;
  }
}
