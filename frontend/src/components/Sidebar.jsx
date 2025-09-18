import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'   
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { deleteDocument, getDocuments, uploadDocument } from '../../api'
import { styled } from '@mui/material/styles';
import List from '@mui/material/List'
import { toast } from 'react-toastify'
const Sidebar = ({ selectedDocId, setSelectedDocId ,mobileOpen , setMobileOpen}) => {

     const[docs ,setDocs] = useState([]);
const drawerWidth = 250
const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  padding: theme.spacing(1),
}));

const handleUpload =async (e) => {
  try {
    const res = await uploadDocument(e.target.files[0]);
    console.log(res.data);
    toast.success("Documents Uploaded successfully")
    pollDocuments(2000,5)
    // documents();
    
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error Uploading documents"   +   error.response.data.error)

  }
  console.log("Uploaded file:", e.target.files[0]);
  // You can add further processing of the file here
}
    const documents = async()=>{
        try {
    const res = await getDocuments();
    setDocs(res.data.data);
    // toast.success("Your Uploaded Documents Are Available To You In The Sidebar")
    console.log(res);
} catch (error) {
    console.error("Error fetching documents:", error)
    toast.error("Error Fetching Documents")
}
    }

useEffect(() => {
    documents();
}, []);

const pollDocuments = (interval = 2000, maxAttempts = 5) => {
  let attempts = 0;
  const poll = setInterval(async () => {
    attempts++;
    await documents(); // refresh docs

    // Stop after max attempts
    if (attempts >= maxAttempts) {
      clearInterval(poll);
    }
  }, interval);
};



const handleId = (id)=>{
  toast.success("Document Attached To Chat Now You Can Ask Questions About The Documents")
// console.log(id)
 setSelectedDocId(id); 
}

const handleDelete = async(id)=>{
  const confirm = window.confirm("Are You Sure You Want To Delete This Document?")
  if(!confirm) return;
  try {
    const res = await deleteDocument(id);
    console.log(res);
    toast.success("Document Deleted Succesfully")
    documents();
    if(selectedDocId === id){
      setSelectedDocId(null);
    }
  } catch (error) {
    toast.error("Error Deleting Document" + error.message)
    console.error("Error Deleting Document:", error)
  }
}

const drawerContent = (
  <>
 <Toolbar variant='dense' sx={{ fontFamily: "Courier New, monospace", fontWeight: 600 , color:"white"}} >
        Documents
    </Toolbar>
       <Divider />
       <Box sx={{ p: 2 ,    overflowY: "auto", height: "calc(100vh - 64px)",
           scrollbarWidth: "none", 
       }}>
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
           
            <Div sx={{ fontFamily: "Courier New, monospace" , fontWeight:600, mb:1
}}  key={doc._id} >{doc.originalName} 
<Typography variant="body2" color="white" sx={{ fontFamily: "Courier New, monospace" , fontWeight:600,mb:1 }}>
File Size : {doc.fileSize}

</Typography>
<Typography variant="body2" color="white" sx={{ fontFamily: "Courier New, monospace" , fontWeight:600, }}>Processing State : {doc.processingStatus}</Typography>
             <Button variant="contained" sx={{  backgroundColor: selectedDocId === doc._id ? "green" :"black" , color:"white" ,mt:2 , p:2, borderRadius:"50px" , fontFamily: "Courier New, monospace" , fontWeight:600, mr:2
}} onClick={()=>handleId(doc._id)}>{selectedDocId === doc._id ? "Selected" :"Select"}</Button>
             <Button variant="contained"sx={{backgroundColor: selectedDocId === doc._id ? "red" :"black" , color:"white" ,mt:2 , p:2, borderRadius:"50px" , fontFamily: "Courier New, monospace" , fontWeight:600,
}} onClick={()=>handleDelete(doc._id)}>Remove</Button>
              </Div>
            
         )) : []}
        </List>


       </Box>

  </>
)
  


// console.log(docs);
  return (
  <>
{/* mobile drawer */}
 <Drawer variant="temporary"  
 open={mobileOpen}
 anchor="left"
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }}
    
    
  >
   {drawerContent}



  </Drawer>
  
  <Drawer variant="permanent" anchor="left" sx={{ width: 300, flexShrink: 0,
    display: { xs: 'none', sm: 'block' },
    '& .MuiDrawer-paper': {
      width: 250,
      boxSizing: 'border-box',
      overflow:"hidden"
    }, }}
    open>
   {drawerContent}



  </Drawer>
  
  
  </>
  )
}

export default Sidebar

