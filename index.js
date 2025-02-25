import express from 'express';
import dotenv from "dotenv"
import morgan from 'morgan';
import { globalMiddleware } from './src/middlewares/auth.js';
import { connectDb } from './src/config/dbConfig.js';
import cors from 'cors'
import AuthRouter from './src/routes/auth.js'
import ContactRouter from './src/routes/contact.js'
import SubscribeRouter from './src/routes/subscribe.js'
import BlogRouter from './src/routes/blog.js'
import DoctorRouter from './src/routes/doctor.js'


dotenv.config();
// Create express app
const app = express();

app.use(express.json());

//enable cors
app.use(cors())

//middlewares
app.use(morgan("dev"));
app.use(globalMiddleware)
//Auth Route
app.use('/api', AuthRouter);
app.use('/api', ContactRouter);
app.use('/api', SubscribeRouter)
app.use('/api/blogs', BlogRouter)
app.use('/api/doctor', DoctorRouter)





app.get('/', (req, res) => {
    res.json({success: true, message: "Welcome to Healthy You"});
});

// routes

// Define your port number
const port = process.env.PORT ;
const dbUrl= process.env.MONGODB_URL;


//CONNECT MONGODB DATABASE
connectDb(dbUrl)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
