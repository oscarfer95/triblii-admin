export const menuOptions: { [key: string]: { icon: string; label: string; url: string } } = {
  home: { icon: 'bi bi-house', label: 'Inicio', url: 'home' },
  attractions: { icon: 'bi bi-geo-alt', label: 'Atracciones', url: 'items/attractions' },
  restaurants: { icon: 'bi bi-shop', label: 'Restaurantes', url: 'items/restaurants' },
  hotels: { icon: 'pi pi-building', label: 'Hoteles', url: 'items/hotels' },
  foods: { icon: 'bi bi-cup-straw', label: 'Comidas', url: 'items/foods' },
  events: { icon: 'pi pi-calendar', label: 'Eventos', url: 'items/events' },
  stats: { icon: 'pi pi-chart-bar', label: 'Estadísticas', url: 'stats' },
  users: { icon: 'pi pi-users', label: 'Usuarios', url: 'users' },
  account: { icon: 'pi pi-user', label: 'Cuenta', url: 'account' }
};

export function generateMenuItems(permissions: string[], role: string): any[] {
  const defaultOptions = ['home', 'stats', 'account'];

  // Caso 1: Sin permisos (array vacío)
  if (permissions.length === 0) {
    const baseMenu = [...defaultOptions];
    if (role === 'ADMIN') {
      baseMenu.splice(baseMenu.length - 1, 0, 'users');
    }
    return baseMenu
      .filter((key) => menuOptions[key])
      .map((key) => menuOptions[key]);
  }

  // Caso 2: Permisos es ['all']
  if (permissions.length === 1 && permissions[0] === 'all') {
    const fullMenuKeys = Object.keys(menuOptions).filter((key) => key !== 'users');

    if (role === 'ADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'users');
    }

    return fullMenuKeys.map((key) => menuOptions[key]);
  }

  const mixedOptions = ['home', ...permissions, 'stats', 'account'];
  if (role === 'ADMIN' && !mixedOptions.includes('users')) {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'users');
  }

  return mixedOptions
    .filter((key) => menuOptions[key])
    .map((key) => menuOptions[key]);
}


export function getMenuItemById(id: string): any | null {
  return menuOptions[id] || null;
}
