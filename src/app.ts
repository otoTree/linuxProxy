import express from 'express';
import cmdRoutes from './routes/cmdRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/cmd', cmdRoutes);

app.get('/', (req, res) => {
  res.send('Hello World from Bun + Express + TypeScript!');
});

export default app;
