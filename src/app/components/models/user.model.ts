// user.model.ts
export interface Usuario {
    nombre: string;
    email: string; // Asegúrate de incluir esto si es parte del perfil
    telefono: string;
    direccion: {
      calle?: string; // Usa '?' para indicar que puede ser undefined
      ciudad?: string;
      estado?: string;
      codigo_postal?: string;
    };
    nueva_contrasenia?: string; 
  }
  