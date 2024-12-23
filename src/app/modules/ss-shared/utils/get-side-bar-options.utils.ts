export const menuOptions: { [key: string]: { icon: string; label: string; url: string } } = {
  home: { icon: 'bi bi-house', label: 'Inicio', url: 'home' },
  attractions: { icon: 'bi bi-geo-alt', label: 'Atracciones', url: 'items/attractions' },
  restaurants: { icon: 'bi bi-shop', label: 'Restaurantes', url: 'items/restaurants' },
  hotels: { icon: 'pi pi-building', label: 'Hoteles', url: 'items/hotels' },
  foods: { icon: 'bi bi-cup-straw', label: 'Comidas', url: 'items/foods' },
  events: { icon: 'pi pi-calendar', label: 'Eventos', url: 'items/events' },
  banners: { icon: 'bi bi-tv', label: 'Banners', url: 'banners' },
  stats: { icon: 'pi pi-chart-bar', label: 'Estadísticas', url: 'stats' },
  users: { icon: 'pi pi-users', label: 'Usuarios', url: 'account/users' },
  locations: { icon: 'pi pi-map', label: 'Locaciones', url: 'locations' },
  account: { icon: 'pi pi-user', label: 'Cuenta', url: 'account/user-entity' }
};

export function generateMenuItems(permissions: string[], role: string): any[] {
  const defaultOptions = ['home', 'account'];

  // No PERMISSIONS
  if (permissions.length === 0) {
    const baseMenu = [...defaultOptions];

    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      baseMenu.splice(baseMenu.length - 1, 0, 'users');
    }

    if (role === 'SUPERADMIN') {
      baseMenu.splice(baseMenu.length - 1, 0, 'locations');
    }

    return baseMenu
      .filter((key) => menuOptions[key])
      .map((key) => menuOptions[key]);
  }

  // ALL PERMISSIONS
  if (permissions.length === 1 && permissions[0] === 'all') {
    const excludedKeys = ['users', 'locations', 'stats'];
    const fullMenuKeys = Object.keys(menuOptions).filter((key) => !excludedKeys.includes(key));

    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'users');
      fullMenuKeys.splice(fullMenuKeys.length - 2, 0, 'stats');
    }

    if (role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'locations');
    }

    return fullMenuKeys.map((key) => menuOptions[key]);
  }

  const mixedOptions = ['home', ...permissions, 'account'];

  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'users');
  }

  if (role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'locations');
  }

  return mixedOptions
    .filter((key) => menuOptions[key])
    .map((key) => menuOptions[key]);
}

export function getMenuItemById(id: string): any | null {
  return menuOptions[id] || null;
}
