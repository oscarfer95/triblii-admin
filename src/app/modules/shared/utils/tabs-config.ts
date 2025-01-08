export interface TabItem {
  label: string;
  icon: string;
}

export const ALL_TAB_ITEMS: TabItem[] = [
  { label: 'Información', icon: 'pi pi-book' },
  { label: 'Opciones', icon: 'pi pi-fw pi-check-square' },
  { label: 'Contacto', icon: 'pi pi-phone' },
  { label: 'Ubicación', icon: 'pi pi-map-marker' },
  { label: 'Horario', icon: 'pi pi-calendar' },
  { label: 'Comidas', icon: 'pi pi-sitemap' },
  { label: 'Galería', icon: 'pi pi-fw pi-images' }
];

export const TAB_CONFIG: Record<string, TabItem[]> = {
  attractions: ALL_TAB_ITEMS,
  restaurants: ALL_TAB_ITEMS,
  events: insertTabs(excludeTabs(ALL_TAB_ITEMS, ['Horario']), [
    { item: { label: 'Fechas', icon: 'pi pi-calendar' }, position: 2 }
  ]),
  foods: excludeTabs(ALL_TAB_ITEMS, ['Comidas', 'Ubicación', 'Horario', 'Fecha', 'Contacto']),
  hotels: insertTabs(excludeTabs(ALL_TAB_ITEMS, ['Comidas']), [
    { item: { label: 'Servicios', icon: 'pi pi-fw pi-bell' }, position: 5 }
  ])
};

function insertTabs(baseTabs: TabItem[], inserts: { item: TabItem; position: number }[]): TabItem[] {
  const result = [...baseTabs];

  inserts.forEach(({ item, position }) => {
    if (position >= 0 && position <= result.length) {
      result.splice(position, 0, item);
    }
  });

  return result;
}

function excludeTabs(baseTabs: TabItem[], excludeLabels: string[]): TabItem[] {
  return baseTabs.filter(tab => !excludeLabels.includes(tab.label));
}

export function getTabItemsById(id: string): TabItem[] {
  return TAB_CONFIG[id] || ALL_TAB_ITEMS;
}
