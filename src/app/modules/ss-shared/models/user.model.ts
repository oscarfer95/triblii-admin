export class User {
  accountId: string;
  entityId: string;
  name: string;
  role: string;

  permissions: string[];
  actions: any;

  constructor() {
    this.name = '';
    this.accountId = '';
    this.entityId = '';
    this.role = '';

    this.permissions = [];
    this.actions = {
      create: true,
      read: true,
      update: true,
      delete: true
    };
  }
}
