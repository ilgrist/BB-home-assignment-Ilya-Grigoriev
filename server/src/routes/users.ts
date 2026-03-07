import express, { Request, Response } from "express";
import { userStatuses } from "../storage";
import { UserStatusResponse } from "../types";
const router = express.Router();

// Check User status
router.post(`/check-status`, (_req: Request, res: Response) => {
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

export default router;