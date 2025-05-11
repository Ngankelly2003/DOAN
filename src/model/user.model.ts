import { IRole } from "./role.model";

export interface INewUser {
  username: string;
  email: string;
  phone: string;
  address?: string;
  roleId: string;
}
export interface IUser extends INewUser {
  userId: string;
  roleEntity?: IRole;
  phoneNumber?: string;
  userName?: string;
}

export interface IChangePassWord {
  userId?: string;
  username: string;
  password: string;
  newpassword: string;
  confirmPassword: string;
}
