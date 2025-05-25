import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  private readonly translators: { [key:string]: string } = {
    // Exceptions
    'Category already exists': 'La categoría ya existe',
    'Location already exists': 'La ubicación ya existe',
    'The email of user already exist': 'El correo electrónico ya existe',
    'The document of user already exist': 'El documento ya existe',

    // Exceptions - not found
    'Location not found': 'Ubicacion no encontrada',
    'Category not found': 'Categoría no encontrada',

    // Successfully Messages
    'Category saved successfully.': 'Categoría guardada exitosamente.',
    'Location saved successfully.': 'Ubicacion guardada exitosamente.',
    'Seller saved successfully': 'Vendedor guardado exitosamente.',
    'House saved successfully': 'Casa guardada exitosamente.',
  }

  translate(key: string): string {
    return this.translators[key] || key;
  }
}
