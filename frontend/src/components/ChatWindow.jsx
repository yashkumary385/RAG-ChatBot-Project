import React from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Avatar from '@mui/material/Avatar';

import { useState } from 'react';
import ChatInput from './ChatInput';
import { askQuestion } from '../../api';
import CircularProgress from "@mui/material/CircularProgress";
// import ListItemText from '@mui/material'
const ChatWindow = ({selectedDocId}) => {
    const [messages , setMessages] = useState([])
    const [recieve , SetRecieve] = useState(false)
    const handleSend =async (msg)=>{
          SetRecieve(true)
          if (!selectedDocId) {
      setMessages((prev)=> [...prev, { sender: "bot", text: "⚠️ Please select a document first." }]);
      return;
    }
      // setMessages(...messages , [{sender:"user" , text:msg}])
      setMessages((prev)=> [...prev, { sender: "user", text: msg }]);

      console.log(msg)
      // if(recieve){
      //    setMessages([...messages, { sender: "bot", text: "Please Wait For Response" }]);
      // }

      try {
        const res = await askQuestion(selectedDocId, msg)
        console.log(res)
        // setMessages((prev)=> [...prev,{sender:"bot", text:res.data.answer}])
        setMessages((prev)=> ([...prev , {sender:"bot", text:res.data.answer}]))
        SetRecieve(false)
      } catch (error) {
        console.log(error)
      }
    }

    // if(recieve){
    //   return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    //     <CircularProgress />
    //   </Box>
    // }
 return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
     <AppBar position="static">
  <Toolbar>
    <Typography
      variant="h6"
      sx={{ fontFamily: "Courier New, monospace", fontWeight: 600, flexGrow: 1 }}
    >
      RAG Chatbot
    </Typography>
    <Avatar alt="Remy Sharp" src="/public/chatbot.jpg" />
  </Toolbar>
</AppBar>


      <Paper
        sx={{
          flex: 1,
          m: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
        elevation={3}
      >
        {/* {recieve && "wait For message"}
         */}
          {/* if(recieve){
        <CircularProgress />
    } */}
   {recieve && (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mt: 2,          // optional: margin top
    }}
  >
    <CircularProgress />
  </Box>
)}
 <Typography variant="h5" color="initial" sx={{display:"flex" ,alignItems:"center" , justifyContent:"center", color:"white" ,fontFamily: "Courier New, monospace" , fontWeight:600 }}>
          LIO BOT
          </Typography>
        <List>
          { messages.length > 0 ? messages.map((msg, i) => (
            <React.Fragment key={i}>
              <ListItem sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: msg.sender === "user" ? "black" : "grey.200",
                    color: msg.sender === "user" ? "white" : "black",
                    borderRadius: 2,
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText primary={msg.text} 
                  sx={{fontFamily: "Courier New, monospace" , fontWeight:600}}
                  />
                </Paper>
              </ListItem>
              <Divider/>
            </React.Fragment>
          )) :
          <Typography variant="h5" color="initial" sx={{display:"flex" ,alignItems:"center" , justifyContent:"center", color:"white" ,fontFamily: "Courier New, monospace" , fontWeight:600 }}>
            Start The Conversation
          </Typography>
          }
        </List>
      </Paper>

      <ChatInput onSend={handleSend} />
    </Box>
  );
}

export default ChatWindow
