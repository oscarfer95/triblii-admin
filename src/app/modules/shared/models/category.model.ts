export class Category {
  name: string;
  iconClass: string;
  photoUrl: string;
  type: string;
  parentId: string;

  order: number;
  available: boolean;
  isFeatured: boolean;

  constructor() {
    this.name = '';
    this.iconClass = '';
    this.photoUrl = '';
    this.type = '';
    this.parentId = '';
    
    this.order = 40;
    this.available = true;
    this.isFeatured = false;
  }
}
