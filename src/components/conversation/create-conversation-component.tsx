import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAlerts } from "../../reducers";
import { HttpService } from "../../service/http-service";
import { useAuthContext } from "../../context/auth-context";
import { Button } from "@material-ui/core";

type SelectedContact = {
  id: number | string | null;
  username: string | null;
};

interface CreateConversationProps {
  selectedUser: SelectedContact | null;
  isLoading?: boolean; // Haz que isLoading sea opcional
}

export const CreateConversationComponent: React.FC<CreateConversationProps> = ({
  selectedUser,
  isLoading = false, // Establece un valor predeterminado para isLoading
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const httpService = new HttpService();
  const { user } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga
  }

  if (!selectedUser) {
    return null;
  }

  async function createConversation() {
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    try {
      const conversationData = {
        user1_id: user?.id,
        user2_id: selectedUser.id,
      };
      const res = await httpService.createConversation(conversationData);
      dispatch(
        setAlerts({
          alert: {
            isOpen: true,
            alert: "success",
            text: `Conversation with "${selectedUser.username}" has been created successfully`,
          },
        })
      );
      navigate(`/t/messages/${res.data.url}`);
    } catch (err) {
      // Handle error
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={createConversation}
      >
        Create Conversation
      </Button>
      <div>Debug: CreateConversationComponent is being rendered.</div>
    </div>
  );
};
