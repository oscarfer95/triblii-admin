export class UserDataModel {
  private _id: string;
  private _accountId: string;
  private _entity: any;
  private _actions: any;
  private _name: string;
  private _permissions: string[];
  private _role: string;
  private _email: string;

  constructor() {
    this._id = '';
    this._accountId = '';
    this._entity = null;
    this._actions = null;
    this._name = '';
    this._permissions = [];
    this._role = '';
    this._email = '';
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get accountId(): string {
    return this._accountId;
  }

  public set accountId(value: string) {
    this._accountId = value;
  }

  public get entity(): any {
    return this._entity;
  }

  public set entity(value: any) {
    this._entity = value;
  }

  public get actions(): any {
    return this._actions;
  }

  public set actions(value: any) {
    this._actions = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get permissions(): string[] {
    return this._permissions;
  }

  public set permissions(value: string[]) {
    this._permissions = value;
  }

  public get role(): string {
    return this._role;
  }

  public set role(value: string) {
    this._role = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }
}
