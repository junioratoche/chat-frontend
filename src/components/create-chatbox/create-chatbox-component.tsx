import {
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/theme-context";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, setAlerts } from "../../reducers";
import { HttpService } from "../../service/http-service";
import { ChatBox } from "../chatbox/chatbox-componente";

import { selectSelectedContact } from "../store/userSlice";
import { useAuthContext } from "../../context/auth-context";
import { CreateConversationComponent } from "../conversation/create-conversation-component";

type SelectedContact = {
  id: number | string | null;
  username: string | null;
};

export const CreateChatBoxComponent = () => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const dispatch = useDispatch();
  const httpService = new HttpService();
  const { user } = useAuthContext();

  const selectedContact: SelectedContact | null = useSelector(
    selectSelectedContact
  );

  useEffect(() => {
    document.title = "Create group";
  }, []);

  async function createGroupByName(event: any) {
    event.preventDefault();
    if (selectedContact && selectedContact.username) {
      // Crea la conversación
      try {
        const conversationData = {
          user1_id: user?.id,
          user2_id: selectedContact.id,
        };
        const conversationRes = await httpService.createConversation(
          conversationData
        );
        dispatch(
          setAlerts({
            alert: {
              isOpen: true,
              alert: "success",
              text: `Conversation with "${selectedContact.username}" has been created successfully`,
            },
          })
        );
        navigate(`/t/messages/${conversationRes.data.url}`);
      } catch (err) {
        // Maneja el error
      }
    }
  }

  return (
    <div
      className={theme}
      style={{
        height: "calc(100% - 64px)",
        textAlign: "center",
        paddingTop: "40px",
      }}
    >
      <Container className={"clrcstm"} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={"main-register-form clrcstm"}>
          <Typography className={"clrcstm"} variant="h6">
            Create a conversation
          </Typography>
        </div>
        <div className={"clrcstm"}>
          <Grid className={"clrcstm"} container spacing={2}>
            <div>
              <Grid item xs={12}>
                <ChatBox />
              </Grid>
              <Grid item xs={12}>
                <CreateConversationComponent selectedUser={selectedContact} />
              </Grid>
            </div>
          </Grid>
        </div>
      </Container>
    </div>
  );
};
