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

    // login exceptions
    'User not found': 'Usuario no encontrado',
    'Incorrect Password': 'La contraseña es incorrecta',
    "You don't have permissions to perform this action": 'No tienes permisos para realizar esta acción',

    // Exceptions - not found
    'Location not found': 'Ubicacion no encontrada',
    'Category not found': 'Categoría no encontrada',

    // Successfully Messages
    'Category saved successfully.': 'Categoría guardada exitosamente.',
    'Location saved successfully.': 'Ubicacion guardada exitosamente.',
    'Seller saved successfully': 'Vendedor guardado exitosamente.',
    'House saved successfully.': 'Casa guardada exitosamente.',
    'The user has successfully logged in': 'El usuario ha iniciado sesión con éxito',
  }

  translate(key: string): string {
    return this.translators[key] || key;
  }
}
