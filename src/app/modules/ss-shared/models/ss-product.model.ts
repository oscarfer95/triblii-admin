export class Attraction {
  available: boolean;
  categories: string[];
  content: string | null;
  coverUrl: string;
  description: string;
  entitiesId: string[];
  foods: string[];
  gallery: string[];
  isFeatured: boolean;
  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    coords: any | null
  };
  name: string;
  order: number;
  rating: number;
  tags: string[];

  constructor() {
    this.available = true;
    this.categories = [];
    this.content = null;
    this.coverUrl = '';
    this.description = '';
    this.entitiesId = [];
    this.foods = [];
    this.gallery = [];
    this.isFeatured = false;
    this.location = {
      address: '',
      city: '',
      country: '',
      state: '',
      coords: null
    };
    this.name = '';
    this.order = 50;
    this.rating = 3;
    this.tags = [];
  }
}

