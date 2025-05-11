import { IAdvertisement, Status } from "./advertisement.model";

export interface INewApproval {
  advertisement: IAdvertisement;
  requestedAt: string;
  approvedAt: string;
  status: Status;
}
export interface IApproval extends INewApproval {
  id: number;
}
