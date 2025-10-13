export interface UpdateUserDTO {
  employeeNumber?: string;
  phoneNumber?: string;
  imageUrl?: string;
  password?: string;
  passwordConfirmation?: string;
  currentPassword: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  imgUrl: string | null;
  isAdmin: boolean;
  company: {
    name: string;
    code: string;
  };
}
