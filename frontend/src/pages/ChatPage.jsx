import React from 'react'
import { useState } from 'react'
import SideBar from '../components/Sidebar.jsx'
import ChatWindow from '../components/ChatWindow.jsx'
import { Box } from '@mui/material'
const ChatPage = () => {
  const [selectedDocId, setSelectedDocId] = useState(null);
  return (
    <>
    <Box sx={{ display: 'flex' ,
    height: '100vh'
    }}>
      <Box 
        sx={{
      width: { xs: "100%", sm: 240 }, // 📱 Full width on mobile, fixed width on desktop
      flexShrink: 0,
    }}
        
    >
    <SideBar selectedDocId={selectedDocId} setSelectedDocId={setSelectedDocId}/>
    </Box>
  <ChatWindow selectedDocId={selectedDocId}/>
  </Box>
    </>
  )
} 

export default ChatPage
