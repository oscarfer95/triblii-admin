export class Location {
  public name: string;
  public description: string;
  public parentId: string;
  public flag: string;
  public photoUrl: string;

  public isFeatured: boolean;
  public available: boolean;
  public order: number;

  constructor() {
    this.name = '';
    this.description = '';
    this.parentId = '';
    this.flag = '';
    this.photoUrl = '';

    this.isFeatured = false;
    this.available = true;
    this.order = Math.floor(Math.random() * (11)) + 45;
  }
}
