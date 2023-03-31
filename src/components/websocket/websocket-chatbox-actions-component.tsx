import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Tooltip
  } from "@mui/material"
  import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
  import React, { useState } from "react"
  import { useDispatch, useSelector } from "react-redux"
  import { useAuthContext } from "../../context/auth-context"
  import { useThemeContext } from "../../context/theme-context"
  import { generateClassName, generateIconColorMode } from "../utils/enable-dark-mode"
  import { StoreState } from "../../reducers/types"
  import { useWebSocketContext } from "../../context/ws-context"
  import { TransportModel } from "../../interface-contract/transport-model"
  import { TransportActionEnum } from "../../utils/transport-action-enum"
  import { HttpService } from "../../service/http-service"
  import { setAlerts, setCurrentActiveGroup } from "../../reducers"
  import { AllUsersDialog } from "../partials/all-users-dialog"
  
  export const WebSocketChatBoxActionsComponent: React.FunctionComponent<{ user: any; onClose: () => void }> = ({ user, onClose }) => {
    const [toolTipAction, setToolTipAction] = useState(false)
    const [openTooltipId, setToolTipId] = useState<number | null>(null)
    const [popupOpen, setPopupOpen] = useState(false)
    const { theme } = useThemeContext()
    const dispatch = useDispatch()
    const { ws } = useWebSocketContext()
    const httpService = new HttpService()
    const { user: currentUser } = useAuthContext()
  
    const {
      currentActiveGroup,
      groups
    } = useSelector((state: StoreState) => state.globalReducer)
  
    function handleTooltipAction(event: any, action: string) {
      event.preventDefault()
      if (action === "open") {
        setToolTipAction(true)
      }
      if (action === "close") {
        setToolTipAction(false)
        setToolTipId(null)
      }
    }
  
    function handleDisplayUserAction(event: any) {
      event.preventDefault()
      setToolTipId(user.id)
    }
  
    function close() {
      if (ws && currentActiveGroup !== null) { // Verificación de null
        const transport = new TransportModel(user?.id, TransportActionEnum.CLOSE_CHAT, undefined, currentActiveGroup);
  
        ws.publish({
          destination: "/app/message",
          body: JSON.stringify(transport)
        })
        onClose()
      }
    }
  
    function handleClose () {
        if (ws && currentActiveGroup !== null && typeof currentActiveGroup === "string") {
          const transport = new TransportModel(
            user?.id,
            TransportActionEnum.LEAVE_GROUP,
            undefined,
            currentActiveGroup
          );
          ws.publish({
            destination: "/app/message",
            body: JSON.stringify(transport)
          });
        }
        // Asegúrate de pasar un objeto con la propiedad "currentActiveGroup" en lugar de simplemente un string
        dispatch(setCurrentActiveGroup({ currentActiveGroup: '' }));
      }
      
  
    return (
      <div>
        {/* Aquí irían los elementos del componente */}
      </div>
    )
  }
  