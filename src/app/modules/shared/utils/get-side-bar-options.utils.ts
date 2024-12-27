export const menuOptions: { [key: string]: { icon: string; label: string; url: string; id: string  } } = {
  home: { icon: 'bi bi-house', label: 'Inicio', url: 'home', id: 'home' },
  attractions: { icon: 'bi bi-geo-alt', label: 'Atracciones', url: 'items/attractions', id: 'attractions' },
  restaurants: { icon: 'bi bi-shop', label: 'Restaurantes', url: 'items/restaurants', id: 'restaurants' },
  hotels: { icon: 'pi pi-building', label: 'Hoteles', url: 'items/hotels', id: 'hotels' },
  foods: { icon: 'bi bi-cup-straw', label: 'Comidas', url: 'items/foods', id: 'foods' },
  events: { icon: 'pi pi-calendar', label: 'Eventos', url: 'items/events', id: 'events' },
  banners: { icon: 'bi bi-tv', label: 'Banners', url: 'banners', id: 'banners' },
  stats: { icon: 'pi pi-chart-bar', label: 'Estadísticas', url: 'stats', id: 'stats' },
  users: { icon: 'pi pi-users', label: 'Usuarios', url: 'account/users', id: 'users' },
  locations: { icon: 'pi pi-map', label: 'Locaciones', url: 'locations', id: 'locations' },
  account: { icon: 'pi pi-user', label: 'Cuenta', url: 'account/user-entity', id: 'account' },
  entities: { icon: 'pi pi-briefcase', label: 'Entidades', url: 'account/entities', id: 'entities' },
  logs: { icon: 'pi pi-history', label: 'Logs', url: 'account/logs', id: 'logs' }
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
      baseMenu.splice(baseMenu.length - 1, 0, 'entities');
      baseMenu.splice(baseMenu.length - 1, 0, 'logs');
    }

    return baseMenu
      .filter((key) => menuOptions[key])
      .map((key) => menuOptions[key]);
  }

  // ALL PERMISSIONS
  if (permissions.length === 1 && permissions[0] === 'all') {
    const excludedKeys = ['users', 'locations', 'stats', 'entities', 'logs'];
    const fullMenuKeys = Object.keys(menuOptions).filter((key) => !excludedKeys.includes(key));

    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'users');
      fullMenuKeys.splice(fullMenuKeys.length - 2, 0, 'stats');
    }

    if (role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'locations');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'entities');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'logs');
    }

    return fullMenuKeys.map((key) => menuOptions[key]);
  }

  const mixedOptions = ['home', ...permissions, 'account'];

  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'users');
  }

  if (role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'locations');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'entities');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'logs');
  }

  return mixedOptions
    .filter((key) => menuOptions[key])
    .map((key) => menuOptions[key]);
}

export function getMenuItemById(id: string): any | null {
  return menuOptions[id] || null;
}
