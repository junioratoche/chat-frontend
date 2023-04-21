import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/theme-context";
import { ChatBox } from "../chatbox/chatbox-componente";

import { useAuthContext } from "../../context/auth-context";
import { HttpService } from "../../service/http-service";
import { setAlerts } from "../../reducers";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  createConversationText: {
    textAlign: "center",
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  createConversationButton: {
    width: "100%",
  },
}));

type Contact = {
  id: number | null;
  username: string | null;
  token: string | null;
  messages: any[];
};

export const CreateChatBoxComponent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const httpService = new HttpService();
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    document.title = "Create conversation";
  }, []);

  const handleContactSelect = (contact: Contact | null) => {
    setSelectedContact(contact);
  };

  async function createConversation() {
    if (!selectedContact) {
      alert("Please select a user");
      return;
    }else{
      alert("Please select a user");
    }

    try {
      const conversationData = {
        user1_id: user?.id,
        user2_id: selectedContact.id,
      };
      const res = await httpService.createConversation(conversationData);
      dispatch(
        setAlerts({
          alert: {
            isOpen: true,
            alert: "success",
            text: `Conversation with "${selectedContact.username}" has been created successfully`,
          },
        })
      );
      navigate(`/t/messages/${res.data.url}`);
    } catch (err) {
      // Handle error
    }
  }

  return (
    <div className={theme}>
      <Container className={"clrcstm"} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={"main-register-form clrcstm"}>
          <Typography className={classes.createConversationText} variant="h6">
            Create a conversation
          </Typography>
        </div>
        <div className={"clrcstm"}>
          <Grid className={"clrcstm"} container spacing={2}>
            <Grid item xs={12}>
              <ChatBox onContactSelect={handleContactSelect} />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.createConversationButton}
                variant="contained"
                color="primary"
                onClick={createConversation}
              >
                Create Conversation
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};
