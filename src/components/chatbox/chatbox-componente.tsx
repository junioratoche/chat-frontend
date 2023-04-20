import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  setSelectedContact,
  selectSelectedContact,
} from "../store/userSlice";

import { HttpService } from "../../service/http-service";
import { ConversationUserModel } from "../../interface-contract/conversation-user-model";
import { debounce } from "lodash";
import { useAuthContext } from "../../context/auth-context";
import { CreateConversationComponent } from "../conversation/create-conversation-component";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    margin: theme.spacing(1),
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

type SearchResult = {
  id: number | string;
  username: string;
};

export const ChatBox = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedContact = useSelector(selectSelectedContact);
  const { user } = useAuthContext();

  const selectedContactSearchResult = selectedContact
    ? { id: selectedContact.id || 0, username: selectedContact.username || "" }
    : null;

  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSendMessage = () => {
    if (!message || !selectedContact?.id) return;
    dispatch(sendMessage({ to: selectedContact.id, content: message }));
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const debouncedSearchUsers = debounce(async (value: string) => {
    setSearchResults(await searchUsers(value));
  }, 2000); // 2000ms de retardo

  const debouncedSearchUsersRef = useRef(debouncedSearchUsers);

  useEffect(() => {
    return () => {
      debouncedSearchUsersRef.current.cancel();
    };
  }, []);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearchUsersRef.current(value);
  };

  const searchUsers = async (term: string): Promise<SearchResult[]> => {
    const httpService = new HttpService();
    const userId = user?.id || -1;
    const users: ConversationUserModel[] = (
      await httpService.fetchAllUsersToAddInConversation(userId)
    ).data;

    return users
      .filter((user) =>
        (
          user.firstName.toLowerCase() +
          " " +
          user.lastName.toLowerCase()
        ).includes(term.toLowerCase())
      )
      .map((user) => ({
        id: user.userId,
        username: user.firstName + " " + user.lastName,
      }));
  };

  const handleContactSelect = (_: string, item: SearchResult | null) => {
    if (item) {
      dispatch(
        setSelectedContact({
          id: Number(item.id),
          username: item.username,
          token: null,
          messages: [],
        })
      );
    }
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.searchContainer}>
          <Autocomplete
            getOptionLabel={(option: SearchResult) => option.username}
            options={searchResults}
            value={selectedContactSearchResult}
            inputValue={searchTerm}
            onInputChange={(_, newInputValue) => {
              handleSearchTermChange(newInputValue);
            }}
            onChange={(_, newValue) => {
              if (newValue) {
                handleContactSelect("", newValue);
              }
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                id="search-input"
                label="Search contacts"
                fullWidth
                variant="outlined"
                className={classes.input}
              />
            )}
          />          
        </Grid>
      </Grid>
    </div>
  );
};

