export interface UpdateUserDTO {
  employeeNumber?: string;
  phoneNumber?: string;
  imageUrl?: string;
  password?: string;
  passwordConfirmation?: string;
  currentPassword: string;
}
