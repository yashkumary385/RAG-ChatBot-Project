import { Box, TextField , IconButton } from '@mui/material'
import React, { useState } from 'react'
import SendIcon from "@mui/icons-material/Send";
const ChatInput = ({onSend}) => {
    const [input , setInput] = useState("")
    const handleSend = ()=>{
        if(!input.trim()) return;
        onSend(input);
        setInput("")
    }
  return (
    <Box>
    <TextField id="filled-basic"
     label="Message"
      variant="filled" 
      onChange={(e)=>setInput(e.target.value)}
      onKeyDown={(e)=> e.key==="Enter" && handleSend()}
      value={input}
      placeholder='Enter Your Question'
    //   color='primary'
          sx={{
               backgroundColor:"black",
               color:"white",
               borderRadius:"50px",
               ml:2
    // fontFamily: "Courier New, monospace" , fontWeight:600,

  }}

      />
         <IconButton sx={{backgroundColor:"black" , ml:2 , mt:1}} onClick={handleSend}>
        <SendIcon sx={{backgroundColor:"black"}}/>
      </IconButton>
    </Box>
  )
}

export default ChatInput

