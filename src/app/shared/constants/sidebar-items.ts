export interface SidebarItem{
    path: string,
    icon: string, 
    label: string
}

export const SIDEBAR_ITEMS: { [key: string]: SidebarItem[] } = {
    ADMIN: [
        { path: '/dashboard', icon: 'dashboard-icon', label: 'Dashboard' },
        { path: '/categories', icon: 'category-icon', label: 'Categorias' },
        { path: '/locations', icon: 'location-icon', label: 'Ubicaciones' },
        { path: '/users', icon: 'user-icon', label: 'Usuarios' },
        { path: '/configuration', icon: 'configuration-icon', label: 'Configuracion' }
    ],
    SELLER: [
        { path: '/houses', icon: 'house-icon', label: 'Mis Propiedades' },
        { path: '/schedulers', icon: 'dashboard-icon', label: 'Visitas' }
    ]
}
