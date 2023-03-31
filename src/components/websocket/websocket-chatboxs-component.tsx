import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { Avatar, List, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../reducers/types";
import { useThemeContext } from "../../context/theme-context";
import { generateColorMode } from "../utils/enable-dark-mode";
import { dateParser } from "../../utils/date-formater";
import {
  clearChatHistory,
  setCurrentActiveGroup,
  setCurrentGroup,
} from "../../reducers";
import { useLoaderContext } from "../../context/loader-context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IGroupMember, IGroupWrapper } from "../../interface-contract/user/group-wrapper-model";

interface IClockType {
  date: string;
}

interface IWebSocketGroupComponent {
  groupUrl: string;
}

const Clock: React.FunctionComponent<IClockType> = ({ date }) => {
  const [currentCount, setCount] = React.useState(dateParser(date));

  React.useEffect(() => {
    const dateInterval = setInterval(() => {
      setCount(dateParser(date));
    }, 60000);
    return () => {
      clearInterval(dateInterval);
    };
  }, [currentCount, date]);

  return <React.Fragment>{dateParser(date)}</React.Fragment>;
};

export const ChatListComponent: React.FunctionComponent<
  IWebSocketGroupComponent
> = ({ groupUrl }) => {
  const { setLoading } = useLoaderContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentGroup, groups, currentActiveGroup, chatHistory } = useSelector(
    (state: StoreState) => state.globalReducer
  );

  const activeChat = currentActiveGroup;
  const chatList = groups;
  const currentUser = currentGroup?.members?.find(
    (member: any) => member.userId === 1
  );

  React.useEffect(() => {
    setLoading(false);
  }, []);

  function selectChat(chatId: string) {
    const chat = chatList.find((chat) => chat.chatId === chatId);
    if (chat) {
      dispatch(clearChatHistory());
      dispatch(setCurrentActiveGroup({ currentActiveGroup: chatId }));
      dispatch(setCurrentGroup({ currentGroup: chat }));
      navigate(`/t/messages/${chat.chatId}`);
    }
  }

  function styleSelectedChat(chatId: string) {
    if (generateColorMode(theme) === "light") {
      return activeChat === chatId ? "selected-group-light" : "";
    }
    if (generateColorMode(theme) === "dark") {
      return activeChat === chatId ? "selected-group-dark" : "";
    }
  }

  function getActiveStyle() {
    const selectedChat = chatList.find((chat) => chat.chatId === activeChat);
    if (selectedChat) {
      return styleSelectedChat(selectedChat.chatId);
    }
    return "";
  }

  function getChatName(chat: IGroupWrapper) {
    if (chat.group.chatType === "individual") {
      const members = chat.group.members.filter(
        (member) => member.userId !== currentUser?.userId
      );
      return members[0]?.name;
    } else {
      return chat.group.name;
    }
  }

  function getChatAvatar(chat: IGroupWrapper) {
    if (chat.group.chatType === "individual") {
      const members = chat.members.filter(
        (member: IGroupMember) => member.userId !== currentUser?.userId
      );
      return members[0]?.avatar;
    } else {
      return chat.group.avatar;
    }
  }
  

  function getLastMessage(chat: any) {
    const messages = chat?.messages;
    const length = messages?.length;

    if (length === 0) {
      return "No messages yet";
    }

    const lastMessage = messages[length - 1];
    const sender = lastMessage?.sender?.username;
    const content = lastMessage?.content;

    if (!sender || !content) {
      return "Error: Last message not found";
    }

    return `${sender}: ${content}`;
  }

  function getTime(lastMessageTime: string | undefined) {
    if (!lastMessageTime) {
      return "No messages yet";
    }

    const currentTime = new Date();
    const timeDifference =
      currentTime.getTime() - new Date(lastMessageTime).getTime();
    const seconds = Math.round(Math.abs(timeDifference) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }
    return "just now";
  }

  return (
    <Link to={`/t/messages/${groupUrl}`} style={{ textDecoration: "none" }}>
      <ListItemButton className={`chat-container ${getActiveStyle()}`}>
        <Avatar>
          <AccountCircleIcon />
        </Avatar>
        <ListItemText
          primary={<React.Fragment>{getChatName(currentGroup)}</React.Fragment>}
          secondary={
            <React.Fragment>
              {getLastMessage(currentGroup)}
              {getLastMessage(currentGroup) && (
                <React.Fragment>
                  <span> · </span>
                </React.Fragment>
              )}
              <span>{getTime(currentGroup?.lastMessage?.date)}</span>
            </React.Fragment>
          }
        />

        {!currentGroup?.lastMessage  && (
          <div className={"unread-bubble"}>{currentGroup?.unreadMessages}</div>
        )}
      </ListItemButton>
    </Link>
  );
};
