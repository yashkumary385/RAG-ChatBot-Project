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
import Button from '@mui/material/Button';
import { askQuestion } from '../../api';
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from 'react-toastify';
// import ListItemText from '@mui/material'
const ChatWindow = ({selectedDocId}) => {
    const [messages , setMessages] = useState([])
    const [recieve , SetRecieve] = useState(false)
    const handleSend =async (msg)=>{
    
          if (!selectedDocId) {
      setMessages((prev)=> [...prev, { sender: "bot", text: "⚠️ Please select a document first." }]);
      SetRecieve(false);
      return;
    }
          SetRecieve(true)

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
        // toast.error(res.data.StatusText === "Service Unavailable" && "ChatBot OverLoaded Try In a minute")
        if(res.data.statusText === "Too Many Requests" || res.data.statusText === "Service Unavailable") {
          toast.error("ChatBot OverLoaded Try In a minute Sorry But We use free tier LLM Models ");
          SetRecieve(false);
          return;
        }
        //  {(res.data.statusText === "Too Many Requests" || "Service Unavailable") && toast.error("ChatBot OverLoaded Try In a minute Sorry But We use free tier LLM Models ")};

        setMessages((prev)=> ([...prev , {sender:"bot", text:res.data.answer}]))   
        SetRecieve(false)
      } catch (error) {
        SetRecieve(false)
        
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
    LIO BOT
    </Typography>
    <Avatar alt="Remy Sharp" src="/chatbot.jpg" />
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
               { msg.sender === "bot" ? <Avatar alt="Remy Sharp" src="/chatbot.jpg" /> : <Avatar alt="Remy Sharp" src="/user1.png" />}
               

                  <ListItemText primary={msg.text}  sx={{fontFamily: "Courier New, monospace" , fontWeight:600}}
                  
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
             {recieve && selectedDocId && handleSend && (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mt: 2,     
      justifyContent:"flex-start" ,// optional: margin top
     
    }}

  >
    <CircularProgress sx={{ color:"white" ,mr:3}} />
    <Typography variant="body2" color="initial" sx={{ color:"white"}}>Bot is typing....</Typography>
   
  </Box>
)}
     </Paper>

      <ChatInput onSend={handleSend} />
    </Box>
  );
}

export default ChatWindow
