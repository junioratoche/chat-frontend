import { useEffect, useState } from "react";
import {
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { selectContacts, setContacts } from "../store/contactsSlice";
import { initWebSocket } from "../../config/websocket-config";
import { makeStyles } from "@material-ui/core/styles";
import { Client } from "@stomp/stompjs";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ContactList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const contacts = useSelector(selectContacts);
  const [error, setError] = useState<string | null>(null);
  const [webSocketClient, setWebSocketClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    const client = initWebSocket(user.token);
    client.activate();
    setWebSocketClient(client);

    return () => {
      client.deactivate();
    };
  }, [user?.token]);

  useEffect(() => {
    if (!webSocketClient) {
      return;
    }

    const subscription = webSocketClient.subscribe(
      "/user/topic/contact-list",
      ({ body }) => {
        const { contacts, error } = JSON.parse(body || "");

        if (error) {
          setError(error);
        } else {
          dispatch(setContacts(contacts));
        }
      }
    );

    webSocketClient.publish({ destination: "/app/get-contact-list" });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, webSocketClient]);

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {contacts.map((contact) => (
          <ListItemButton key={contact.id}>
            <ListItemAvatar>
              <Avatar>{contact.username[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={contact.username} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ContactList;
