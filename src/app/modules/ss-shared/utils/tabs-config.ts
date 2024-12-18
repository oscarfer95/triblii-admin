export interface TabItem {
  label: string;
  icon: string;
}

export const ALL_TAB_ITEMS: TabItem[] = [
  { label: 'Información', icon: 'pi pi-book' },
  { label: 'Opciones', icon: 'pi pi-fw pi-check-square' },
  { label: 'Ubicación', icon: 'pi pi-map-marker' },
  { label: 'Galería', icon: 'pi pi-fw pi-images' },
  { label: 'Horario', icon: 'pi pi-calendar' },
  { label: 'Comidas', icon: 'pi pi-sitemap' }
];

const TAB_CONFIG: Record<string, TabItem[]> = {
  attractions: [
    { label: 'Información', icon: 'pi pi-book' },
    { label: 'Opciones', icon: 'pi pi-fw pi-check-square' },
    { label: 'Ubicación', icon: 'pi pi-map-marker' },
    { label: 'Galería', icon: 'pi pi-fw pi-images' }
  ],
  restaurants: [
    { label: 'Información', icon: 'pi pi-book' },
    { label: 'Opciones', icon: 'pi pi-fw pi-check-square' },
    { label: 'Ubicación', icon: 'pi pi-map-marker' },
    { label: 'Horario', icon: 'pi pi-calendar' },
    { label: 'Galería', icon: 'pi pi-fw pi-images' },
    { label: 'Comidas', icon: 'pi pi-sitemap' }
  ]
};

export function getTabItemsById(id: string): TabItem[] {
  return TAB_CONFIG[id] || ALL_TAB_ITEMS;
}
