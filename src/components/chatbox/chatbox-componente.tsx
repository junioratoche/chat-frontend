import React, { useState, useRef, useEffect } from "react";
import { TextField, Grid } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { useAuthContext } from "../../context/auth-context";
import { HttpService } from "../../service/http-service";
import { ConversationUserModel } from "../../interface-contract/conversation-user-model";

type SearchResult = {
  id: number | string;
  username: string;
};

type Contact = {
  id: number | null;
  username: string | null;
  token: string | null;
  messages: any[];
};

interface ChatBoxProps {
  onContactSelect: (contact: Contact | null) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const { user } = useAuthContext();

  const { onContactSelect } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const debouncedSearchUsersRef = useRef(debounce(async (value: string) => {
    setSearchResults(await searchUsers(value));
  }, 2000));

  useEffect(() => {
    debouncedSearchUsersRef.current = debounce(async (value: string) => {
      setSearchResults(await searchUsers(value));
    }, 2000);
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

  const handleContactSelect = (
    _: React.SyntheticEvent<Element, Event>,
    item: SearchResult | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<SearchResult> | undefined
  ) => {
    console.log(`item= ${JSON.stringify(item)}`);

    if (item && !isNaN(Number(item.id))) {
      // Asegurarse de que item.id sea un número
      onContactSelect({
        id: Number(item.id),
        username: item.username,
        token: null,
        messages: [],
      });
    } else {
      onContactSelect(null);
    }
  };

  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid
        item
        xs={12}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Autocomplete
          getOptionLabel={(option: SearchResult) => option.username}
          options={searchResults}
          inputValue={searchTerm}
          onInputChange={(_, newInputValue) => {
            handleSearchTermChange(newInputValue);
          }}
          onChange={handleContactSelect}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              sx={{ margin: 1, width: "100%" }}
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
          isOptionEqualToValue={(option, value) =>
            option.id === value.id && option.username === value.username
          }
          clearOnBlur={false}
        />
      </Grid>
    </Grid>
  );  
  
};
