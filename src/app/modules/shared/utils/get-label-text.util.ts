import { ADMIN_MODULES_LIST, MODULES_LIST } from "../constants/modules.constant";

export function getLocationTypeText(type: string): string {
  let text = '';

  switch (type) {
    case 'HOME':
      text = 'Casa';
      break;

    case 'WORK':
      text = 'Trabajo';
    break;

    case 'OTHER':
      text = 'Otro';
    break;

    case 'APARTMENT':
      text = 'Departamento';
    break;
  }

  return text;
}

export function getActionLabel(action: string): string {
  let label = '';

  switch (action.toLowerCase()) {
    case 'create':
      label = 'Crear'
      break;

    case 'update':
      label = 'Editar'
      break;

    case 'read':
      label = 'Leer'
      break;

    case 'delete':
      label = 'Eliminar'
      break;
  }

  return label;
}

export function getSingularActionLabel(action: string): string {
  let label = '';

  switch (action.toLowerCase()) {
    case 'create':
      label = 'Creado'
      break;

    case 'update':
      label = 'Actualizado'
      break;

    case 'read':
      label = 'Leído'
      break;

    case 'delete':
      label = 'Eliminado'
      break;
  }

  return label;
}

export function getModuleLabel(moduleId: string): string {
  const modules = [...MODULES_LIST, ...ADMIN_MODULES_LIST];

  return modules.find((item: any) => item.id === moduleId).name;
}

export function getSingularModuleLabel(moduleId: string): string {
  const modules = [...MODULES_LIST, ...ADMIN_MODULES_LIST];

  return modules.find((item: any) => item.id === moduleId).singular;
}