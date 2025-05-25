export interface SidebarItem{
    path: string,
    icon: string, 
    label: string
}

export const SIDEBAR_ITEMS: { [key: string]: SidebarItem[] } = {
    ADMIN: [
        { path: '/admin/dashboard', icon: 'dashboard-icon', label: 'Dashboard' },
        { path: '/admin/categories', icon: 'category-icon', label: 'Categorias' },
        { path: '/admin/locations', icon: 'location-icon', label: 'Ubicaciones' },
        { path: '/admin/users', icon: 'user-icon', label: 'Usuarios' },
        { path: '/admin/configuration', icon: 'configuration-icon', label: 'Configuracion' }
    ],
    SELLER: [
        { path: '/seller/dashboard', icon: 'dashboard-icon', label: 'Dashboard' },
        { path: '/seller/houses', icon: 'house-icon', label: 'Mis Propiedades' },
        { path: '/seller/schedulers', icon: 'scheduler-icon', label: 'Visitas' },
        { path: '/seller/configuration', icon: 'configuration-icon', label: 'Configuracion' }
    ]
}
