import mongoose from "mongoose";

const queryCacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },  // user’s question
  answer: { type: String, required: true },               // chatbot’s response
  createdAt: { type: Date, default: Date.now, expires: 3600 } // auto-delete after 1 hour
});

export default mongoose.model("QueryCache", queryCacheSchema);
