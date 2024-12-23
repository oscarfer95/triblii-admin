export class Item {
  name: string;
  description: string;
  coverUrl: string;
  content: any | null;

  categories: string[];
  tags: string[];
  rating: number;
  order: number;
  isFeatured: boolean;
  available: boolean;

  gallery: string[];

  foods: string[];

  entitiesId: string[];

  constructor() {
    this.name = '';
    this.description = '';
    this.coverUrl = '';
    this.content = null;

    this.categories = [];
    this.tags = [];
    this.rating = 3;
    this.order = 50;
    this.isFeatured = false;
    this.available = true;

    this.gallery = [];

    this.foods = [];

    this.entitiesId = [];
  }

  static createInstance(type: string): Item {
    switch (type.toLowerCase()) {
      case 'events':
        return new Event();

      case 'restaurants':
        return new Restaurant();

      case 'attractions':
        return new Attraction();

      case 'hotels':
        return new Hotel();

      case 'foods':
        return new Food();

      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}

// Attraction
export class Attraction extends Item {
  schedule: any | null;
  price: string;
  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    coords: any | null;
  };

  constructor() {
    super();
    this.schedule = null;
    this.price = '';
    this.location = {
      address: '',
      city: '',
      country: '',
      state: '',
      coords: null,
    };
    this.categories = ['recreation-musement'];
  }
}

// Restaurants
export class Restaurant extends Item {
  schedule: any | null;
  delivery: any | null
  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    coords: any | null;
  };

  constructor() {
    super();
    this.categories = ['gastronomy'];
    this.schedule = null;
    this.delivery = null;
    this.location = {
      address: '',
      city: '',
      country: '',
      state: '',
      coords: null,
    };
  }
}

// Foods
export class Food extends Item {
  priceRange: string;

  constructor() {
    super();
    this.priceRange = '';
    this.categories = ['gastronomy'];
  }
}

// Events
export class Event extends Item {
  price: string;
  capacity: number;

  isOnline: boolean;
  isRecurring: boolean;
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unique';

  // Unique
  startDate: Date | null;
  endDate: Date | null;

  //weekly
  recurrenceDays: null | {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  };
  recurrenceDates: number[] | null;
  recurrenceMonths: number[] | null;

  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    coords: any | null;
  };

  constructor() {
    super();
    this.price = '';
    this.capacity = 0;
    this.endDate = new Date();
    this.isOnline = false;
    this.isRecurring = false;
    this.recurrenceType = 'unique';

    this.startDate = null;
    this.endDate = null;
    this.recurrenceDays = null;
    this.recurrenceDates = null;
    this.recurrenceMonths = null;

    this.location = {
      address: '',
      city: '',
      country: '',
      state: '',
      coords: null,
    };

    this.categories = ['experiences-activities', 'general-interest', 'recreation-musement'];
  }
}

// Hotels
export class Hotel extends Item {

  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    coords: any | null;
  };

  constructor() {
    super();
    this.location = {
      address: '',
      city: '',
      country: '',
      state: '',
      coords: null,
    };
  }
}
