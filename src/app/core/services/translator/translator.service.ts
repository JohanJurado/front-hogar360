import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  private translators: { [key:string]: string } = {
    // Exceptions
    'Category already exists': 'La categoría ya existe',
    'Location already exists': 'La ubicación ya existe',

    // Successfully Messages
    'Category saved successfully.': 'Categoría guardada exitosamente.',
    'Location saved successfully.': 'Ubicacion guardada exitosamente.',
  }

  translate(key: string): string {
    return this.translators[key] || key;
  }
}
