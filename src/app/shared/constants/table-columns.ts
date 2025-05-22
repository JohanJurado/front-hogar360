
export const TABLE_COLUMNS = {
    CATEGORY: [
        { key: 'id', title: 'ID', type: 'id', prefix: 'CAT-2025' },
        { key: 'name', title: 'Nombre' },
        { key: 'description', title: 'Descripción' },
    ],
    LOCATIONS: [
    { key: 'id', title: 'ID', type: 'id', prefix: 'LOC-2025' },
    { key: 'nameDepartment', title: 'Nombre Departamento', isActive: false, orderBy: 'department' },
    { key: 'nameCity', title: 'Nombre Ciudad', isActive: true, orderAsc: true, orderBy: 'city' },
    { key: 'neighborhood', title: 'Barrio/Sector' },
  ]
}