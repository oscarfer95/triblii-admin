export class TtSubscriptionTypeResponse  {
  private _id: string;
  private _name: string;
  private _imagesLimit: number;
  private _pdfsLimit: number;
  private _monthsDuration: number;

  constructor() {
    this._id = '';
    this._name = '';
    this._imagesLimit = 0;
    this._pdfsLimit = 0;
    this._monthsDuration = 0;
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get imagesLimit(): number {
    return this._imagesLimit;
  }

  public set imagesLimit(value: number) {
    this._imagesLimit = value;
  }

  public get pdfsLimit(): number {
    return this._pdfsLimit;
  }

  public set pdfsLimit(value: number) {
    this._pdfsLimit = value;
  }

  public get monthsDuration(): number {
    return this._monthsDuration;
  }

  public set monthsDuration(value: number) {
    this._monthsDuration = value;
  }
}
