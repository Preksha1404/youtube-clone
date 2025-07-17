import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Cors configuration --> to allow cross-origin requests
// This is important for the frontend to communicate with the backend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Accept JSON data from request (body-parser is used internally by express)
app.use(express.json({limit: "16kb"}))
// Accept URL encoded data from request
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// Serve static files from the "public" directory
app.use(express.static("public"))
// Set and get secure cookies which are set by the server
app.use(cookieParser())


// Import routes
import userRoutes from './routes/user.routes.js';

// Use routes
app.use('/api/v1/users', userRoutes);


export {app};