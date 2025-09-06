import mongoose from "mongoose";
const chunkSchema = new mongoose.Schema({
   documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",    
        required: true
   },
   text: {
        type: String,
        required: true,
   },
   embedding: { 
        type: Number,
        required: true,
   },chunkIndex: {
        type: Number,
        required: true, 
   },metadata:{
    startPosition: Number,
    endPosition: Number,
    pageNumber: Number,
    wordCount: Number,
    characterCount: Number,
    section: String,
   },
   createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})
chunkSchema.index({ documentId: 1, chunkIndex: 1 });
chunkSchema.index({ documentId: 1 });


export default mongoose.model("Chunk",chunkSchema)