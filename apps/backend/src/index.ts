import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import aiRouter from './routes/ai';
import employeesRouter from './routes/employees';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/employees', employeesRouter);
app.use('/api/ai', aiRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Employee Journey API running on http://localhost:${port}`);
});
