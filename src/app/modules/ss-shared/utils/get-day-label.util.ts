export function getDayLabel(day: string) {
  let label = '';

  switch (day) {
    case 'monday':
      label = 'Lunes'
      break;

    case 'tuesday':
      label = 'Martes'
      break;

    case 'wednesday':
      label = 'Miércoles'
      break;

    case 'thursday':
      label = 'Jueves'
      break;

    case 'friday':
      label = 'Viernes'
      break;

    case 'saturday':
      label = 'Sábado'
      break;

    case 'sunday':
      label = 'Domingo'
      break;
  }

  return label;
}
