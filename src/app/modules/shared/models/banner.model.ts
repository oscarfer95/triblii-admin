export class Banner {
  public backgroundUrl: string;
  public buttonLabel: string;
  public buttonLink: string;
  public entitiesId: any[];
  public description: string;
  public isSponsored: boolean;
  public available: boolean;
  public pngUrl: string;
  public title: string;
  public order: number;

  constructor() {
    this.entitiesId = [];
    this.backgroundUrl = '';
    this.description = '';
    this.buttonLabel = '';
    this.buttonLink = '';
    this.pngUrl = '';
    this.title = '';
    this.isSponsored = false;
    this.available = true;
    this.order = Math.floor(Math.random() * (11)) + 45;
  }
}
