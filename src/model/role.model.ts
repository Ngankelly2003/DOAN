export interface INewRole {
  roleCode: string;
  description: string;
}
export interface IRole extends INewRole {
  roleId: string;
}
