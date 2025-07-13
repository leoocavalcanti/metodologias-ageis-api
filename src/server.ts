import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
}); 