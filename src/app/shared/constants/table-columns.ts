
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
    ],
    HOUSES: [
      { key: 'id', title: 'ID', type: 'id', prefix: 'HOU-2025' },
      { key: 'name', title: 'Nombre' },
      { key: 'bedroomCount', title: 'Habitaciones', type: 'number' },
      { key: 'bathroomCount', title: 'Baños', type: 'number' },
      { key: 'price', title: 'Precio', type: 'price'},
      { key: 'cityName', title: 'Nombre Ciudad' },
    ],
    HOUSES_ACTIONS: [
      { key: 'new-scheduler', type: 'action', icon: './assets/img/new-scheduler-icon.svg'},
      { key: 'list-schedulers', type: 'action', icon: './assets/img/list-schedulers-icon.svg'},
    ],
    SCHEDULERS: [
      { key: 'id', title: 'ID', type: 'id', prefix: 'SCH-2025' },
      { key: 'startDate', title: 'Fecha Inicio', type: 'date' },
      { key: 'endDate', title: 'Fecha Fin', type: 'date' },
    ],
}