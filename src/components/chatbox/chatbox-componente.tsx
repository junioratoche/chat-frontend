import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, selectSelectedContact, selectUser } from "../store/userSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    margin: theme.spacing(1),
  },
}));

const ChatBox = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const selectedContact = useSelector(selectSelectedContact);

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message || !selectedContact?.id) return;  
    dispatch(sendMessage({ to: selectedContact.id, content: message }));
    setMessage("");
  };
  

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };  

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={11}>
          <TextField
            id="message-input"
            label="Type your message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={classes.input}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton aria-label="send" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatBox;
