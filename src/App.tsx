import React from "react"
import "./App.css"
import { LinearProgress } from "@mui/material"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { CreateGroupComponent } from "./components/create-group/create-group-component"
import { HeaderComponent } from "./components/partials/header-component"
import { LoginComponent } from "./components/login/login-component"
import { WebSocketMainComponent } from "./components/websocket/websocket-main-component"
import { useLoaderContext } from "./context/loader-context"
import { HomeComponent } from "./components/home"
import { AlertComponent } from "./components/partials/alert-component"
import { VideoComponent } from "./components/websocket/video-component"
import { RegisterFormComponent } from "./components/register/register-user"
import ContactList from "./components/contactlist/contactlist-componente"
import { CreateChatBoxComponent } from "./components/create-chatbox/create-chatbox-component"

export const App = (): JSX.Element => {
  const { loading } = useLoaderContext()

  return (
    <Router>
      {loading && (
        <LinearProgress
          style={{
            position: "absolute",
            top: "0",
            width: "100%",
          }}
        />
      )}
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/create" element={<CreateGroupComponent />} />
        <Route path="/t/messages" element={<WebSocketMainComponent />} />
        <Route path="/t/messages/:groupId" element={<WebSocketMainComponent />} />
        <Route path="/register" element={<RegisterFormComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/call/:uuid" element={<VideoComponent />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/chatbox" element={<CreateChatBoxComponent />} />
      </Routes>
      <AlertComponent />
    </Router>
  )
}
