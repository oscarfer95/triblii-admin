export const menuOptions: { [key: string]: { icon: string; label: string; url: string } } = {
  home: { icon: 'bi bi-house', label: 'Inicio', url: 'home' },
  attractions: { icon: 'bi bi-geo-alt', label: 'Atracciones', url: 'items/attractions' },
  restaurants: { icon: 'bi bi-shop', label: 'Restaurantes', url: 'items/restaurants' },
  hotels: { icon: 'pi pi-building', label: 'Hoteles', url: 'items/hotels' },
  foods: { icon: 'bi bi-cup-straw', label: 'Comidas', url: 'items/foods' },
  events: { icon: 'pi pi-calendar', label: 'Eventos', url: 'items/events' },
  users: { icon: 'pi pi-users', label: 'Usuarios', url: 'users' },
  stats: { icon: 'pi pi-chart-bar', label: 'Estadísticas', url: 'stats' },
  account: { icon: 'pi pi-user', label: 'Cuenta', url: 'account' },
};

export function generateMenuItems(items: string[]): any[] {
  const defaultOptions = ['home', ...items, 'account', 'stats'];

  if (items.length === 0 || (items.length === 1 && items[0] === 'all')) {
    return Object.values(menuOptions);
  }

  const result = [...defaultOptions];

  items
    .filter((item) => menuOptions[item] && !defaultOptions.includes(item))
    .forEach((item) => result.push(item));

  return result.map((key) => menuOptions[key]);
}

export function getMenuItemById(id: string): any | null {
  return menuOptions[id] || null;
}
