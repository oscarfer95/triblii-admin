export class Entity {
  name: string;
  description: string;
  photoUrl: string;
  phone: any;

  location: any;
  slug: string;
  color: string;
  isPublic: boolean;

  constructor() {
    this.name = '';
    this.description = '';
    this.photoUrl = '';
    this.phone = {
      countryCode: '',
      dialCode: '',
      internationalNumber: '',
      nationalNumber: '',
      number: ''
    };

    this.location = {
      cityIds: [],
      countryIds: []
    };
    this.slug = '';
    this.color = '';
    this.isPublic = false;
  }
}
