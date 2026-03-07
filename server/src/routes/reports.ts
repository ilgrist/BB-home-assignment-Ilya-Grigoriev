import { reports } from "../storage";
import { Report, ReportCreateResponse } from "../types";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(reports);
});

router.post('/', upload.single('attachment'), (req: Request, res: Response) => {
  const { issueType, description, contactName, contactEmail } = req.body;

  const newReport: Report = {
    id: uuidv4(),
    issueType: issueType || '',
    description: description || '',
    contactName: contactName || '',
    contactEmail: contactEmail || '',
    status: 'NEW',
    createdAt: Date.now(),
    attachmentUrl: req.file ? `/uploads/${uuidv4()}-${req.file.originalname}` : '/uploads/placeholder.txt'
  };

  reports.push(newReport);

  const response: ReportCreateResponse = {
    id: newReport.id,
    status: newReport.status,
    createdAt: newReport.createdAt,
    approvedAt: newReport.approvedAt
  };

  res.status(201).json(response);
});

router.put('/:id', (req: Request, res: Response) => {
  const index = reports.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const updates: Partial<Report> = req.body;
  const updatedReport: Report = { ...reports[index], ...updates };

  if (updates.status === 'APPROVED') {
    updatedReport.approvedAt = Date.now();
  }

  reports[index] = updatedReport;
  res.json(updatedReport);
});

export default router;
