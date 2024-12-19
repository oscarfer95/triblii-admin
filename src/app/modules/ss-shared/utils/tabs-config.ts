export interface TabItem {
  label: string;
  icon: string;
}

export const ALL_TAB_ITEMS: TabItem[] = [
  { label: 'Información', icon: 'pi pi-book' },
  { label: 'Opciones', icon: 'pi pi-fw pi-check-square' },
  { label: 'Ubicación', icon: 'pi pi-map-marker' },
  { label: 'Galería', icon: 'pi pi-fw pi-images' },
  { label: 'Comidas', icon: 'pi pi-sitemap' }
];

export const TAB_CONFIG: Record<string, TabItem[]> = {
  attractions: insertTabs(ALL_TAB_ITEMS, [
    { item: { label: 'Horario', icon: 'pi pi-calendar' }, position: 3 }
  ]),
  restaurants: insertTabs(ALL_TAB_ITEMS, [
    { item: { label: 'Delivery', icon: 'pi pi-send' }, position: 3 },
    { item: { label: 'Horario', icon: 'pi pi-calendar' }, position: 4 }
  ]),
  events: insertTabs(ALL_TAB_ITEMS, [
    { item: { label: 'Fecha', icon: 'pi pi-calendar' }, position: 3 }
  ]),
  foods: excludeTabs(ALL_TAB_ITEMS, ['Comidas', 'Ubicación']),
  hotels: insertTabs(ALL_TAB_ITEMS, [])
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
