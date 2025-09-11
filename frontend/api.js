import axios from "axios"

const API_URL =import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// console.log(API_URL );

const api = axios.create({
  baseURL: API_URL,
});


export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("pdf", file);
  return api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}



// get all docs
export const getDocuments = () => {
  return api.get("/documents");
}

// ask question
export const askQuestion = (selectedDocId, msg) => {
  console.log(selectedDocId, msg);
  return api.post("/query", { documentId:selectedDocId, question:msg });
}


export default api;
