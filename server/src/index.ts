import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserStatusResponse } from './types';
import { userStatuses } from './storage';
import reportRoutes from './routes/reports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// API Routes
app.use('/api/reports', reportRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Check User status
app.post('/api/check-status', (_req: Request, res: Response) => {
  const { email } = _req.body;

  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter is required' });
  };

  const user = userStatuses.find(entry => entry.email === email);

  if(!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const response: UserStatusResponse = { status: user.status };
  if(user.status === 'blacklisted' && user.reason) {
    response.reason = user.reason;
  }

  res.json(response);
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Uploads served at http://localhost:${PORT}/uploads`);
});
