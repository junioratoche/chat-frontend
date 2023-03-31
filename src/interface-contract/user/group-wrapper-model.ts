import { GroupModel } from "../group-model"
import { IGroupCall } from "./group-call-model"

export interface IGroupMember {
  userId: string;
  name: string;
  username: string;
  avatar?: string;
}



export interface IGroupWrapper {
  group: GroupModel;
  groupCall: IGroupCall;
  chatId: string;
  lastMessage?: {
    date: string;
    content: string;
    sender: {
      id: string;
      name: string;
      username: string;
      avatar?: string;
    };
  };
  members: IGroupMember[];
  unreadMessages?: number;
}


