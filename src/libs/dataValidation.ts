export function isValidPassword(password: string) {
  // Regex:
  // ^                         -> Inicio de la cadena
  // (?=.*[A-Z])               -> Debe contener al menos una letra mayúscula
  // (?=.*[a-z])               -> Debe contener al menos una letra minúscula
  // (?=.*\d)                  -> Debe contener al menos un dígito
  // (?=.*[!@#$%^&*()_+\-=\[\]{};':"|,.<>/?]) -> Debe contener al menos un carácter especial
  // .{8,}                     -> Debe tener una longitud mínima de 8 caracteres
  // $                         -> Fin de la cadena
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/;

  // Elimina los espacios en blanco de la contraseña
  const passwordWithoutSpaces = password.replace(/\s/g, '');

  return passwordRegex.test(passwordWithoutSpaces);
}