import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/theme-context";
import { useDispatch } from "react-redux";
import { setAlerts } from "../../reducers";
import { CustomTextField } from "../partials/custom-material-textfield";
import { HttpService } from "../../service/http-service";

export const CreateChatBoxComponent = () => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const dispatch = useDispatch();
  const httpService = new HttpService();
  const [contact, setContact] = useState("");
  const [contactDetails, setContactDetails] = useState<any>(null);

  useEffect(() => {
    document.title = "Create chat box";
  }, []);

  async function handleCreateChatBox(event: any) {
    event.preventDefault();
    if (!contactDetails) {
      dispatch(
        setAlerts({
          alert: {
            isOpen: true,
            alert: "error",
            text: "Contact not found",
          },
        })
      );
      return;
    }
    const conversationData = {
      members: [contactDetails._id],
      isGroup: false,
    };
    const response = await httpService.createConversation(conversationData);
    const conversation = response.data;
    navigate(`/chatbox/${conversation._id}`);
  }

  async function handleSearchContact(event: any) {
    event.preventDefault();
    if (!contact) {
      return;
    }
    try {
      const response = await httpService.searchUser(contact);
      setContactDetails(response.data);
    } catch (error) {
      setContactDetails(null);
      dispatch(
        setAlerts({
          alert: {
            isOpen: true,
            alert: "error",
            text: error.response?.data?.message || "Error searching contact",
          },
        })
      );
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
            Add Contact to Conversation
          </Typography>
        </div>
        <div className={"clrcstm"}>
          <Grid className={"clrcstm"} container spacing={2}>
            <Grid className={"clrcstm"} item xs={12}>
              <CustomTextField
                id={"addContact"}
                label={"Type contact email"}
                name={"contactEmail"}
                handleChange={handleChange}
                value={contactEmail}
                type={"email"}
                keyUp={submitAddContact}
                isDarkModeEnable={theme}
                isMultiline={false}
              />
            </Grid>
            <div>
              <Grid item xs={12}>
                <Button
                  className={"button-register-form"}
                  style={{ marginTop: "15px" }}
                  onClick={(event) => addContactToConversation(event)}
                  fullWidth
                  variant="outlined"
                  color="primary"
                >
                  Add Contact
                </Button>
              </Grid>
            </div>
          </Grid>
        </div>
      </Container>
    </div>
  );
};
