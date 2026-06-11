import { Router } from 'express';
import { getEmployeeById } from '../data/mockData';
import { askEmployeeQuestion, generateInsights } from '../services/aiService';

const aiRouter = Router();

aiRouter.post('/insights', async (req, res) => {
  const employeeId = typeof req.body.employeeId === 'string' ? req.body.employeeId : undefined;
  const employee = employeeId ? getEmployeeById(employeeId) : req.body.employee;

  if (!employee) {
    res.status(400).json({ message: 'employeeId or employee payload is required' });
    return;
  }

  const insights = await generateInsights(employee);
  res.json(insights);
});

aiRouter.post('/ask', async (req, res) => {
  const question = typeof req.body.question === 'string' ? req.body.question.trim() : '';
  const employeeId = typeof req.body.employeeId === 'string' ? req.body.employeeId : undefined;
  const managerId = typeof req.body.managerId === 'string' ? req.body.managerId : undefined;

  if (!question) {
    res.status(400).json({ message: 'question is required' });
    return;
  }

  const response = await askEmployeeQuestion(question, employeeId, managerId);
  res.json(response);
});

export default aiRouter;
