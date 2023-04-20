import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid } from "@material-ui/core";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedContact,
  selectSelectedContact,
} from "../store/userSlice";

import { HttpService } from "../../service/http-service";
import { ConversationUserModel } from "../../interface-contract/conversation-user-model";
import { debounce } from "lodash";
import { useAuthContext } from "../../context/auth-context";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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
                className={classes.input}
                placeholder="Buscar contactos"
                variant="outlined"
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            )}
            clearOnBlur={false} // Agregar esta línea
          />
        </Grid>
      </Grid>
    </div>
  );

};
