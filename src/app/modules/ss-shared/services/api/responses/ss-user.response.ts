export class SsUserResponse  {
  private _id: string;
  private _accountId: string;
  private _configurationsList: string[];
  private _fullName: string;
  private _photo: string;
  private _subscriptionId: string;

  constructor() {
    this._id = '';
    this._accountId = '';
    this._configurationsList = [];
    this._fullName = '';
    this._photo = '';
    this._subscriptionId = '';
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get accountId(): string {
    return this._accountId;
  }

  public set accountId(value: string) {
    this._accountId = value;
  }

  public get configurationsList(): string[] {
    return this._configurationsList;
  }

  public set configurationsList(value: string[]) {
    this._configurationsList = value;
  }

  public get fullName(): string {
    return this._fullName;
  }

  public set fullName(value: string) {
    this._fullName = value;
  }

  public get photo(): string {
    return this._photo;
  }

  public set photo(value: string) {
    this._photo = value;
  }

  public get subscriptionId(): string {
    return this._subscriptionId;
  }

  public set subscriptionId(value: string) {
    this._subscriptionId = value;
  }
}
