import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// While working with database two things are important:
// 1) It takes time --> use async-await
// 2) It can fail --> use try-catch or Promise

const connectDB = async () => {
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB