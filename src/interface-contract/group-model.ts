export class GroupModel {
  public id: number;
  public url: string;
  public name: string;
  public groupType: string;
  public lastMessage: string;
  public lastMessageDate: string;
  public lastMessageSeen: boolean;
  public lastMessageSender?: string;
  public members: any[];
  public chatType: string;
  public avatar?: string; // nueva propiedad

  constructor(
    id: number,
    url: string,
    name: string,
    groupType: string,
    lastMessage: string,
    lastMessageDate: string,
    lastMessageSeen: boolean,
    lastMessageSender: string,
    members: any[],
    chatType: string,
    avatar?: string // nueva propiedad
  ) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.groupType = groupType;
    this.lastMessage = lastMessage;
    this.lastMessageDate = lastMessageDate;
    this.lastMessageSeen = lastMessageSeen;
    this.lastMessageSender = lastMessageSender;
    this.members = members;
    this.chatType = chatType;
    this.avatar = avatar; // asignar el valor del avatar
  }
}
