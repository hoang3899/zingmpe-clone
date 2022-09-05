import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import mongoose from 'mongoose';
import meRouter from './routes/meRoutes.js';
import trackRouter from './routes/trackRoutes.js';
import artistRouter from './routes/artistRoutes.js';
import abumRouter from './routes/abumRoutes.js';
import seedRouter from './routes/seedRoutes.js';


const app = express()


app.use(cors({ origin: true }));
app.use(express.json());


//connect to the DB
dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to DB')
}).catch((err) => {
    console.log(err.message);
})

//seedRouter
app.use("/api/seed", seedRouter);

//router
app.use("/api/me" , meRouter);



//router use for admin
app.use("/api/admin/artist", artistRouter);
app.use("/api/admin/track", trackRouter);
app.use("/api/abum" , abumRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server at: http://localhost:${port}`)
})