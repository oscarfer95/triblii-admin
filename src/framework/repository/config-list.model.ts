export interface ConfigList {
  queryList?: WhereConfig[];
  orderByConfigList?: OrderByConfig [];
}

export interface OrderByConfig {
  field: string;

  direction: string;
}

export interface WhereConfig {
  field: string;

  operation: string;

  value: string[] | string | boolean;
}
