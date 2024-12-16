export class SsAccountModel {
  private _id: string;
  private _email: string;

  constructor() {
    this._id = '';
    this._email = '';
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }
}
