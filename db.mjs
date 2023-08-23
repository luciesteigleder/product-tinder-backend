import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const client = mongoose.connect(process.env.DB_CONNECT, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => {
console.log('MongoDB Atlas connected!');
}).catch(err => {
console.log(err);
});

export default client;