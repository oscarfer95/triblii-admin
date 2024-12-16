import {SsAccountModel} from "./ss-account.model";

export class SsUserDataModel  {
  private _id: string;
  private _account!: SsAccountModel;
  private _fullName: string;
  private _photo: string;
  private _catalogueList: any;
  private _bannerList: any;

  constructor() {
    this._id = '';
    this._fullName = '';
    this._photo = '';
    this._catalogueList = [];
    this._bannerList = [];
  }

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get account(): SsAccountModel {
    return this._account;
  }

  public set account(value: SsAccountModel) {
    this._account = value;
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

  public get catalogueList(): any {
    return this._catalogueList;
  }

  public set catalogueList(value: any) {
    this._catalogueList = value;
  }

  public get bannerList(): any {
    return this._bannerList;
  }

  public set bannerList(value: any) {
    this._bannerList = value;
  }
}
