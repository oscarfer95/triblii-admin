export class TtSubscriptionResponse  {
  private _id: string;
  private _active: boolean;
  private _initDate!: Date;
  private _subscriptionTypeId: string;

  constructor() {
    this._id = '';
    this._active = false;
    this._subscriptionTypeId = '';
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = value;
  }

  public get initDate(): Date {
    return this._initDate;
  }

  public set initDate(value: Date) {
    this._initDate = value;
  }

  public get subscriptionTypeId(): string {
    return this._subscriptionTypeId;
  }

  public set subscriptionTypeId(value: string) {
    this._subscriptionTypeId = value;
  }
}
