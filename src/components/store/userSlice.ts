import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: number;
  to: number;
  from: number;
  content: string;
  timestamp: string;
}

export interface UserState {
  id: number | null;
  username: string | null;
  token: string | null;
  selectedContact: UserState | null;
  messages: Message[];
}

const initialState: UserState = {
  id: null,
  username: null,
  token: null,
  selectedContact: null,
  messages: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.token = null;
    },
    setSelectedContact: (state, action: PayloadAction<UserState>) => {
      state.selectedContact = action.payload;
    },
    sendMessage: (state, action: PayloadAction<{ to: number; content: string; }>) => {
      const newMessage: Message = {
        id: state.messages.length + 1,
        to: action.payload.to,
        from: state.id as number,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
    },
  },
});

export const { setUser, clearUser, setSelectedContact, sendMessage } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user;
export const selectSelectedContact = (state: { user: UserState }) => state.user.selectedContact;
