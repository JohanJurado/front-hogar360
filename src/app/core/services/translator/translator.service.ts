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
    'The date range has already been set aside': 'El rango de fechas ya ha sido reservado',
    'Invalid date range, start date cannot be greater than the end date': 'Rango de fechas no válido, la fecha de inicio no puede ser mayor que la fecha final',

    // login exceptions
    'User not found': 'Usuario no encontrado',
    'Incorrect Password': 'La contraseña es incorrecta',
    "You don't have permissions to perform this action": 'No tienes permisos para realizar esta acción',

    // Exceptions - not found
    'Location not found': 'Ubicacion no encontrada',
    'Category not found': 'Categoría no encontrada',
    'House not found': 'Propiedad no encontrada',

    // Successfully Messages
    'Category saved successfully.': 'Categoría guardada exitosamente.',
    'Location saved successfully.': 'Ubicacion guardada exitosamente.',
    'Seller saved successfully': 'Vendedor guardado exitosamente.',
    'House saved successfully.': 'Casa guardada exitosamente.',
    'The user has successfully logged in': 'El usuario ha iniciado sesión con éxito',
    'The visit scheduler have been successfully added': 'El horario de visita se ha añadido correctamente',
    'The visit has been added successfully': 'La visita se ha añadido correctamente',
  }

  translate(key: string): string {
    return this.translators[key] || key;
  }
}
