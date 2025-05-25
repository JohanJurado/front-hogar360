export interface House {
    id?: number,
    name: string,
    description: string,
    bedroomCount: number,
    bathroomCount: number,
    price: number,
    activePublicationDate?: Date,
    emailSeller?: string,
    neighborhood: string,
    cityName: string,
    departmentName: string,
    categoryName: string
}