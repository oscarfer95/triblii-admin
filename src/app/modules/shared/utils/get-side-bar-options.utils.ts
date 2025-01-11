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
  logs: { icon: 'pi pi-history', label: 'Historial', url: 'account/logs', id: 'logs' },
  categories: { icon: 'pi pi-bookmark', label: 'Categorías', url: 'items/superadmin/module/categories', id: 'categories' },
  tags: { icon: 'pi pi-tags', label: 'Etiquetas', url: 'items/superadmin/module/tags', id: 'tags' }
};

export function generateMenuItems(permissions: string[], role: string): any[] {
  const defaultOptions = ['home', 'account'];

  // No PERMISSIONS
  if (permissions.length === 0) {
    const baseMenu = [...defaultOptions];

    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      baseMenu.splice(baseMenu.length - 1, 0, 'users');
      baseMenu.splice(baseMenu.length - 1, 0, 'stats');
      baseMenu.splice(baseMenu.length - 1, 0, 'logs');
    }

    if (role === 'SUPERADMIN') {
      baseMenu.splice(baseMenu.length - 1, 0, 'categories');
      baseMenu.splice(baseMenu.length - 1, 0, 'tags');
      baseMenu.splice(baseMenu.length - 1, 0, 'locations');
      baseMenu.splice(baseMenu.length - 1, 0, 'entities');
    }

    return baseMenu
      .filter((key) => menuOptions[key])
      .map((key) => menuOptions[key]);
  }

  // ALL PERMISSIONS
  if (permissions.length === 1 && permissions[0] === 'all') {
    const excludedKeys = ['users', 'locations', 'stats', 'entities', 'logs', 'categories', 'tags'];
    const fullMenuKeys = Object.keys(menuOptions).filter((key) => !excludedKeys.includes(key));

    if (role === 'ADMIN' || role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'users');
      fullMenuKeys.splice(fullMenuKeys.length - 2, 0, 'stats');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'logs');
    }

    if (role === 'SUPERADMIN') {
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'categories');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'tags');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'locations');
      fullMenuKeys.splice(fullMenuKeys.length - 1, 0, 'entities');
    }

    return fullMenuKeys.map((key) => menuOptions[key]);
  }

  const mixedOptions = ['home', ...permissions, 'account'];

  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'users');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'stats');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'logs');
  }

  if (role === 'SUPERADMIN') {
    mixedOptions.splice(mixedOptions.length - 1, 0, 'categories');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'tags');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'locations');
    mixedOptions.splice(mixedOptions.length - 1, 0, 'entities');
  }

  return mixedOptions
    .filter((key) => menuOptions[key])
    .map((key) => menuOptions[key]);
}

export function getMenuItemById(id: string): any | null {
  return menuOptions[id] || null;
}

export function transformMenuItems(inputArray: any) {
  const menuStructure = {
    Inicio: [],
    Módulos: [],
    Administrador: [],
    Estadísticas: [],
    Historial: [],
    Cuenta: [],
  };

  const categoryMap = {
    home: 'Inicio',
    attractions: 'Módulos',
    restaurants: 'Módulos',
    hotels: 'Módulos',
    foods: 'Módulos',
    events: 'Módulos',
    banners: 'Módulos',
    categories: 'Módulos',
    tags: 'Módulos',
    users: 'Administrador',
    locations: 'Administrador',
    entities: 'Administrador',
    stats: 'Estadísticas',
    logs: 'Historial',
    account: 'Cuenta',
  };

  inputArray.forEach((item) => {
    const category = categoryMap[item.id];
    if (category in menuStructure) {
      menuStructure[category].push({
        label: item.label,
        icon: item.icon,
        routerLink: item.url,
        routerLinkActive: 'ss-sidebar-menu--active'
      });
    }
  });

  const menuItems = [];

  Object.entries(menuStructure).forEach(([key, value]) => {
    if (value.length > 0) {
      if (key === 'Inicio' || key === 'Estadísticas' || key === 'Historial' || key === 'Cuenta') {
        menuItems.push({
          label: key,
          icon: value[0].icon,
          routerLink: value[0].routerLink
        });
        
      } else if (key === 'Módulos' || key === 'Administrador') {
        menuItems.push({
          label: key,
          icon: key === 'Módulos' ? 'pi pi-th-large' : 'pi pi-key',
          items: value
        });
      }
    }
  });

  return menuItems;
}
