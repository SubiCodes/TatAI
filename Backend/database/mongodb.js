import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    throw new Error('Please define the DB_URI in the .env file');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`MongoDB Connected in ${NODE_ENV} mode: ${DB_URI}`)
    }catch (error){
        console.log(error);
        process.exit(1);
    }
};

export default connectToDatabase;