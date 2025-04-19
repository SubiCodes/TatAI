import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import preferenceRouter from './routes/preference.routes.js';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js'
import guideRouter from './routes/guide.route.js'

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, origin); // Reflect the origin (allow all)
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/preference', preferenceRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/guide', guideRouter);

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;