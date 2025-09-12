import React from 'react'
import { useState } from 'react'
import SideBar from '../components/Sidebar.jsx'
import ChatWindow from '../components/ChatWindow.jsx'
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import MenuIcon from "@mui/icons-material/Menu";
const ChatPage = () => {
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }


  return (
    <>
      <Box sx={{
        display: 'flex',
        height: '100vh'
      }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: { sm: "none" },
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1300,
          }}
        >
          <MenuIcon sx={{ color: "black" }} />
        </IconButton>





        <SideBar selectedDocId={selectedDocId} setSelectedDocId={setSelectedDocId} mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen} />
        <Box sx={{ flexGrow: 1, p: 2 }}>

          <ChatWindow selectedDocId={selectedDocId} />
        </Box>
      </Box>
    </>
  )
}

export default ChatPage
