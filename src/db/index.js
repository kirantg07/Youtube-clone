import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`connection established with db ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("ERROR connection FAILED :",error);
        process.exit(1)
    }
    

}
export default connectDB