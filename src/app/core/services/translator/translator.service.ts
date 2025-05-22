import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  private translators: { [key:string]: string } = {
    // Exceptions
    'Category already exists': 'La categoría ya existe',
    'Location already exists': 'La ubicación ya existe',
    'The email of user already exist': 'El correo electrónico ya existe',
    'The document of user already exist': 'El documento ya existe',

    // Successfully Messages
    'Category saved successfully.': 'Categoría guardada exitosamente.',
    'Location saved successfully.': 'Ubicacion guardada exitosamente.',
    'Seller saved successfully': 'Vendedor guardado exitosamente.'
  }

  translate(key: string): string {
    return this.translators[key] || key;
  }
}
