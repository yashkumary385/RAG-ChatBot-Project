import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'   
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { getDocuments, uploadDocument } from '../../api'
import { styled } from '@mui/material/styles';
import List from '@mui/material/List'
import { toast } from 'react-toastify'
const Sidebar = ({ selectedDocId, setSelectedDocId }) => {

    const [file , setFile] = useState(null);
     const[docs ,setDocs] = useState([]);

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  padding: theme.spacing(1),
}));
const handleUpload =async (e) => {
  setFile(e.target.files[0]);
  try {
    const res = await uploadDocument(e.target.files[0]);
    console.log(res.data);
    toast.success("Documents fetched successfully")

  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error fetching documents" + error.message)

  }
  console.log("Uploaded file:", e.target.files[0]);
  // You can add further processing of the file here
}


useEffect(() => {
    const documents = async()=>{
        try {
    const res = await getDocuments();
    setDocs(res.data.data);
    console.log(res);
} catch (error) {
    console.error("Error fetching documents:", error)
}
    }
    documents();


}, []);
const handleId = (id)=>{
// console.log(id)
 setSelectedDocId(id); 
}
// console.log(docs);
  return (
  <>
  <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
    }, }}>
    <Toolbar variant='dense' sx={{ fontFamily: "Courier New, monospace", fontWeight: 600 , color:"white"}} >
        Documents
    </Toolbar>
       <Divider />
       <Box sx={{ p: 2 }}>
         <Button
          variant="contained"
          component="label"
          fullWidth
            startIcon={<DriveFolderUploadIcon />}
              sx={{
      backgroundColor: "black",
      fontFamily: "Courier New, monospace" , fontWeight:600,
      color: "white",
      "&:hover": {
        backgroundColor: "#333", // slightly lighter black on hover
      },
    }}
        >
          Upload Doc
          <input hidden type="file" onChange={handleUpload} />
        </Button>
        <List>
         {docs ? docs.map((doc) => (
           
            <Div sx={{      fontFamily: "Courier New, monospace" , fontWeight:600,
}}  key={doc._id} >{doc.originalName}
             <Button variant="contained"sx={{backgroundColor:"black" , color:"white" ,mt:2 , p:2, borderRadius:"50px" , fontFamily: "Courier New, monospace" , fontWeight:600,
}} onClick={()=>handleId(doc._id)}>{selectedDocId === doc._id ? "Selected" :"Select"}</Button>
              </Div>
            
         )) : []}
        </List>


       </Box>




  </Drawer>
  
  
  </>
  )
}

export default Sidebar

