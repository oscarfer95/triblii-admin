export class SsSubscriptionModel {
  public _id: string;
  private _active: boolean;
  private _initDate: Date;
  private _subscriptionType: any;

  constructor() {
    this._id = '';
    this._active = false;
    this._initDate = new Date();
    this._subscriptionType = '';
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

  public get subscriptionType(): any {
    return this._subscriptionType;
  }

  public set subscriptionType(value: any) {
    this._subscriptionType = value;
  }
}
