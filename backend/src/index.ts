import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidro rodando na porta ${PORT}`)
});