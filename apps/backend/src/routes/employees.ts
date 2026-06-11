import { Router } from 'express';
import { getEmployeeById, getEmployeesForManager } from '../data/mockData';
import { generateJourneySummary } from '../services/aiService';

const employeesRouter = Router();

employeesRouter.get('/', (req, res) => {
  const managerId = typeof req.query.managerId === 'string' ? req.query.managerId : undefined;
  res.json(getEmployeesForManager(managerId));
});

employeesRouter.get('/:id/journey-summary', async (req, res) => {
  const employee = getEmployeeById(req.params.id);

  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  const summary = await generateJourneySummary(employee);
  res.json({ employeeId: employee.id, summary });
});

employeesRouter.get('/:id', (req, res) => {
  const employee = getEmployeeById(req.params.id);

  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(employee);
});

export default employeesRouter;
