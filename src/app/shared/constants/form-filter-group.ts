import { FormControl, FormGroup, Validators } from "@angular/forms";

export const FORM_FILTER_GROUP: { [key: string]: FormGroup } = {
    LOCATIONS: new FormGroup({
        nameLocation: new FormControl('', Validators.required),
        orderBy: new FormControl('city', Validators.required),
        orderAsc: new FormControl(true, Validators.required)
    }),
    HOUSES: new FormGroup({
        location: new FormControl('', Validators.required),
        nameCategory: new FormControl(null, Validators.required),
        bedroomCount: new FormControl(null, Validators.required),
        bathroomCount: new FormControl(null, Validators.required),
        minPrice: new FormControl(null, Validators.required),
        maxPrice: new FormControl(null, Validators.required),
        orderBy: new FormControl('city', Validators.required),
        orderAsc: new FormControl(true, Validators.required),
    }),
}
