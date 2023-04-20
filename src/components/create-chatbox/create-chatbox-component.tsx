import {
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/theme-context";
import { useSelector } from "react-redux";
import { ChatBox } from "../chatbox/chatbox-componente";
import { CreateConversationComponent } from "../conversation/create-conversation-component"; // Asegúrate de importar este componente

import { selectSelectedContact } from "../store/userSlice";

export const CreateChatBoxComponent = () => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const selectedContact = useSelector(selectSelectedContact);

  useEffect(() => {
    document.title = "Create conversation";
  }, []);

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
            </div>
          </Grid>
          <CreateConversationComponent selectedUser={selectedContact} /> {/* Añadir esta línea */}
        </div>
      </Container>
    </div>
  );
};
