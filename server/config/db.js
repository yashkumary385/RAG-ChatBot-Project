import mongoose from "mongoose"
const connectDb = async () => { // doesnt handles http request not an api route handler .
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongo db connected ${conn.connection.host}`);
    }
    catch (err) {
        // console.log('db cant be connected');
        console.error("MongoDB connection failed:", err.message);
        process.exit(1)
    }
}
export default connectDb