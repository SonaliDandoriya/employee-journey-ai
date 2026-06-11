import { Router } from 'express';
import { getEmployeeById, getEmployeesForManager, getPendingEmployeeById, getPendingEmployeesForManager } from '../data/mockData';
import { generateJourneySummary, generatePendingHireInsights } from '../services/aiService';

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

// ─── Pending / pre-boarding hires ────────────────────────────────────────────

const pendingRouter = Router();

pendingRouter.get('/', (req, res) => {
  const managerId = typeof req.query.managerId === 'string' ? req.query.managerId : undefined;
  res.json(getPendingEmployeesForManager(managerId));
});

pendingRouter.get('/:id/insights', async (req, res) => {
  const pending = getPendingEmployeeById(req.params.id);

  if (!pending) {
    res.status(404).json({ message: 'Pending hire not found' });
    return;
  }

  const insights = await generatePendingHireInsights(pending);
  res.json(insights);
});

pendingRouter.get('/:id', (req, res) => {
  const pending = getPendingEmployeeById(req.params.id);

  if (!pending) {
    res.status(404).json({ message: 'Pending hire not found' });
    return;
  }

  res.json(pending);
});

export { pendingRouter };
export default employeesRouter;
