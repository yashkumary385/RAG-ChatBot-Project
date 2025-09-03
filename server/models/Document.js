import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    }, uploadPath: {
        type: String,
        required: true,
    },
    processingState: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: "pending"
    },
    chunkCount: {
        type: Number,
        default: 0
    },
    metadata: {
        pageCount: Number,
        chunkCount: Number,
        language: String,
        extractedDate: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

documentSchema.index({ title: 1 }); // for fast searching
documentSchema.index({ createdAt: -1 });
documentSchema.index({ processingStatus: 1 });
export default mongoose.model("Document", documentSchema)