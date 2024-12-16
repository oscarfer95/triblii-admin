export function getStatusConfig(status: string) {
  let config = {
    color: '',
    icon: '',
    text: ''
  }

  switch (status) {
    case 'PENDING':
      config.color = 'warning'
      config.icon = 'pi pi-clock';
      config.text = 'Pendiente';
      break;

    case 'PAID':
      config.color = 'green'
      config.icon = 'pi pi-money-bill';
      config.text = 'Pagado';
      break;

    case 'FAILED':
      config.color = 'red'
      config.icon = 'pi pi-ban';
      config.text = 'Cancelado';
      break;
  }

  return config;
}

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

export function getShippingMethodTypeText(type: string): string {
  let text = '';

  switch (type) {
    case 'DELIVERY':
      text = 'A domicilio';
      break;

    case 'PICKUP':
      text = 'Recojo en local';
    break;
  }

  return text;
}

export function getItemsQuantity(list: any): number {
  let quantity = 0;

  list.forEach((product: any) => {
    quantity = quantity + product.quantityOrder;
  });

  return quantity;
}
