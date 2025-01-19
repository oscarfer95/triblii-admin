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
  location: any;
  contact: any;

  constructor() {
    super();
    this.categories = ['recreation-musement'];
    this.schedule = SCHEDULE_DAYS;
    this.location = LOCATION;
    this.contact = CONTACT;
  }
}

// Restaurants
export class Restaurant extends Item {
  schedule: any | null;
  location: any;
  contact: any;

  constructor() {
    super();
    this.categories = ['gastronomy'];
    this.schedule = SCHEDULE_DAYS;
    this.location = LOCATION;
    this.contact = CONTACT;
  }
}

// Foods
export class Food extends Item {

  constructor() {
    super();
    this.categories = ['gastronomy'];
  }
}

// Events
export class Event extends Item {
  dates: any;
  location: any;
  contact: any;

  constructor() {
    super();
    this.categories = ['experiences-activities', 'general-interest', 'recreation-musement'];
    this.location = LOCATION;
    this.contact = CONTACT;
    this.dates = DATES;
  }
}

// Hotels
export class Hotel extends Item {

  location: any;
  schedule: any | null;
  contact: any;
  services: any | null;

  constructor() {
    super();
    this.categories = ['general-interest'];
    this.schedule = SCHEDULE_DAYS;
    this.location = LOCATION;
    this.contact = CONTACT;
    this.services = [];
  }
}

//Schedule
export const SCHEDULE_DAYS: any = {
  available: false,
  alwaysOpen: false,
  days: [
    {
      day: 'monday',
      open: '',
      close: ''
    },
    {
      day: 'tuesday',
      open: '',
      close: ''
    },
    {
      day: 'wednesday',
      open: '',
      close: ''
    },
    {
      day: 'thursday',
      open: '',
      close: ''
    },
    {
      day: 'friday',
      open: '',
      close: ''
    },
    {
      day: 'saturday',
      open: '',
      close: ''
    },
    {
      day: 'sunday',
      open: '',
      close: ''
    }
  ]
}

//Location
export const LOCATION = {
  address: '',
  city: '',
  country: '',
  state: '',
  coords: null,
};

//Dates
const RECURRENCY_DAYS = [
  {
    day: 'monday',
    active: false
  },
  {
    day: 'tuesday',
    active: false
  },
  {
    day: 'wednesday',
    active: false
  },
  {
    day: 'thursday',
    active: false
  },
  {
    day: 'friday',
    active: false
  },
  {
    day: 'saturday',
    active: false
  },
  {
    day: 'sunday',
    active: false
  }
]

export const DATES = {
  recurrenceType: 'unique',

  //Unique
  startDate: null,
  endDate: null,

  //weekly
  recurrenceDays: RECURRENCY_DAYS
}

// Contact
export const CONTACT = {
  available: true,
  rrss: []
};

//Dates
export const RECURRENCY_DATE: any[] = [
  {
    id: 'unique',
    label: 'Único'
  },
  {
    id: 'weekly',
    label: 'Semanal'
  }
];
