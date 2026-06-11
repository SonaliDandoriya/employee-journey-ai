import OpenAI from 'openai';
import { Employee, PendingEmployee, getEmployeeById, getEmployeesForManager } from '../data/mockData';

interface EmployeeInsightPayload {
  summary: string;
  riskAnalysis: string;
  recommendedActions: string[];
  keyHighlights: string[];
}

interface AskResponse {
  answer: string;
  recommendedActions: string[];
}

const openAIClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const formatDate = (value?: string) => {
  if (!value) {
    return 'not scheduled';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

const getRiskLabel = (riskScore: number) => {
  if (riskScore >= 70) return 'high';
  if (riskScore >= 40) return 'moderate';
  return 'low';
};

const getSentimentNarrative = (sentiment: Employee['feedback']['sentiment']) => {
  switch (sentiment) {
    case 'positive':
      return 'Feedback sentiment is positive, indicating healthy engagement.';
    case 'needs_attention':
      return 'Feedback sentiment needs attention, suggesting manager follow-up is important.';
    default:
      return 'Feedback sentiment is neutral with no major red flags.';
  }
};

const buildRecommendedActions = (employee: Employee): string[] => {
  const actions = new Set<string>();

  if (employee.status === 'onboarding') {
    actions.add('Schedule a 30-day check-in and confirm onboarding milestones.');
    actions.add('Assign a learning buddy to accelerate early ramp-up.');
  }

  if (employee.learning.overdueCourses > 0) {
    actions.add(`Resolve ${employee.learning.overdueCourses} overdue learning item(s), prioritising compliance content.`);
  }

  if (employee.workflows.some((workflow) => workflow.status === 'overdue')) {
    actions.add('Review overdue workflow steps with the employee and re-assign owners if needed.');
  }

  if (employee.feedback.sentiment === 'needs_attention' || employee.riskScore >= 70) {
    actions.add('Book a manager check-in this week to address blockers and engagement risk.');
  }

  if (employee.performance.goals.some((goal) => goal.status === 'at_risk')) {
    actions.add('Re-baseline performance goals and agree on short-term recovery milestones.');
  }

  if (employee.status === 'offboarding') {
    actions.add('Track knowledge handover and access removal before the exit date.');
  }

  if (actions.size === 0) {
    actions.add('Maintain the current cadence and continue recognising positive momentum.');
    actions.add('Use the next 1:1 to reinforce growth opportunities and stretch goals.');
  }

  return Array.from(actions).slice(0, 4);
};

const buildSummary = (employee: Employee) => {
  const overdueCourses = employee.learning.courses.filter((course) => course.status === 'overdue');
  const atRiskGoals = employee.performance.goals.filter((goal) => goal.status === 'at_risk');
  const topGoal = employee.performance.goals[0];

  const opening = `${employee.name} is a ${employee.role} in ${employee.department} with a ${getRiskLabel(employee.riskScore)} risk profile (${employee.riskScore}/100).`;

  const onboarding = employee.onboarding.status === 'in_progress'
    ? `${employee.onboarding.progress}% of onboarding tasks are complete, and the current target date is ${formatDate(employee.onboarding.dueDate)}.`
    : 'Core onboarding activities are complete.';

  const learning = overdueCourses.length > 0
    ? `${employee.learning.completedCourses} of ${employee.learning.enrolledCourses} learning items are complete, with overdue items in ${overdueCourses.map((course) => course.name).join(', ')}.`
    : `${employee.learning.completedCourses} of ${employee.learning.enrolledCourses} learning items are complete with no overdue courses.`;

  const performance = employee.performance.rating === 'not_reviewed'
    ? 'A formal performance rating has not been recorded yet.'
    : `Performance is currently rated ${employee.performance.rating?.replace('_', ' ')}, and ${topGoal ? `the lead goal "${topGoal.name}" is ${topGoal.progress}% complete.` : 'goal progress is being tracked.'}`;

  const risks = atRiskGoals.length > 0
    ? `${atRiskGoals.length} performance goal(s) are at risk and should be reviewed in the next manager check-in.`
    : 'Performance goals are tracking without major risk signals.';

  return `${opening} ${onboarding} ${learning} ${performance} ${risks}`;
};

const buildRiskAnalysis = (employee: Employee) => {
  const riskDrivers: string[] = [];

  if (employee.learning.overdueCourses > 0) {
    riskDrivers.push(`${employee.learning.overdueCourses} overdue learning requirement(s)`);
  }

  if (employee.workflows.some((workflow) => workflow.status === 'overdue')) {
    riskDrivers.push('overdue workflow commitments');
  }

  if (employee.feedback.sentiment === 'needs_attention') {
    riskDrivers.push('low feedback sentiment');
  }

  if (employee.performance.rating === 'below') {
    riskDrivers.push('below-expectation performance rating');
  }

  if (employee.status === 'onboarding') {
    riskDrivers.push('new hire ramp-up');
  }

  if (employee.status === 'offboarding') {
    riskDrivers.push('planned transition activities');
  }

  return riskDrivers.length > 0
    ? `${employee.name}'s current risk score is driven by ${riskDrivers.join(', ')}.`
    : `${employee.name}'s risk score is low with no immediate intervention required.`;
};

const buildHighlights = (employee: Employee): string[] => {
  const highlights = [
    `${employee.onboarding.completedTasks}/${employee.onboarding.totalTasks} onboarding tasks completed`,
    `${employee.learning.completedCourses}/${employee.learning.enrolledCourses} courses completed`,
    getSentimentNarrative(employee.feedback.sentiment)
  ];

  if (employee.performance.rating) {
    highlights.push(`Performance rating: ${employee.performance.rating.replace('_', ' ')}`);
  }

  return highlights;
};

const getMockEmployeeInsights = (employee: Employee): EmployeeInsightPayload => ({
  summary: buildSummary(employee),
  riskAnalysis: buildRiskAnalysis(employee),
  recommendedActions: buildRecommendedActions(employee),
  keyHighlights: buildHighlights(employee)
});

const getTeamAskResponse = (question: string, managerId?: string): AskResponse => {
  const normalizedQuestion = question.toLowerCase();
  const team = getEmployeesForManager(managerId);
  const overdueEmployees = team.filter((employee) => employee.learning.overdueCourses > 0);
  const atRiskEmployees = team.filter((employee) => employee.riskScore >= 70);
  const onboardingEmployees = team.filter((employee) => employee.status === 'onboarding');

  if (normalizedQuestion.includes('overdue') || normalizedQuestion.includes('compliance')) {
    return {
      answer: overdueEmployees.length > 0
        ? `The team members with overdue learning or compliance items are ${overdueEmployees.map((employee) => employee.name).join(', ')}. ${overdueEmployees.map((employee) => `${employee.name} has ${employee.learning.overdueCourses} overdue course${employee.learning.overdueCourses > 1 ? 's' : ''}`).join('; ')}.`
        : 'No one on the team currently has overdue compliance or learning requirements.',
      recommendedActions: overdueEmployees.length > 0
        ? ['Escalate overdue compliance items this week.', 'Review course blockers during the next team check-in.']
        : ['Keep the current learning cadence and recognise completion momentum.']
    };
  }

  if (normalizedQuestion.includes('attention') || normalizedQuestion.includes('risk')) {
    return {
      answer: atRiskEmployees.length > 0
        ? `${atRiskEmployees.map((employee) => employee.name).join(', ')} need the most attention right now because of elevated risk scores, overdue workflows, or feedback signals.`
        : 'No employees are currently in the high-risk zone. James Mitchell may need light coaching because of a moderate risk score and one overdue compliance item.',
      recommendedActions: atRiskEmployees.length > 0
        ? ['Schedule focused 1:1s with at-risk employees.', 'Create a short-term recovery plan for overdue workflows.']
        : ['Continue weekly monitoring and proactive coaching.']
    };
  }

  if (normalizedQuestion.includes('onboarding')) {
    return {
      answer: onboardingEmployees.length > 0
        ? `Onboarding progress is active for ${onboardingEmployees.map((employee) => employee.name).join(', ')}. ${onboardingEmployees.map((employee) => `${employee.name} is ${employee.onboarding.progress}% complete and due by ${formatDate(employee.onboarding.dueDate)}`).join('; ')}.`
        : 'There are no employees currently in onboarding.',
      recommendedActions: ['Confirm onboarding milestone owners.', 'Ensure all new hires have a learning buddy and 30-day check-in booked.']
    };
  }

  return {
    answer: `Across the team, ${team.length} employees are in scope. ${overdueEmployees.length} have overdue learning items, ${onboardingEmployees.length} are onboarding or transitioning, and ${atRiskEmployees.length} are currently high risk. Priya Patel is the strongest momentum example, while David Chen needs the fastest intervention.` ,
    recommendedActions: ['Prioritise high-risk recovery plans.', 'Use high performers to mentor newer or struggling team members.']
  };
};

const getEmployeeAskResponse = (employee: Employee, question: string): AskResponse => {
  const normalizedQuestion = question.toLowerCase();
  const overdueCourses = employee.learning.courses.filter((course) => course.status === 'overdue');
  const inProgressCourses = employee.learning.courses.filter((course) => course.status === 'in_progress');
  const overdueWorkflows = employee.workflows.filter((workflow) => workflow.status === 'overdue');

  if (normalizedQuestion.includes('overdue') && normalizedQuestion.includes('course')) {
    return {
      answer: overdueCourses.length > 0
        ? `${employee.name} is overdue on ${overdueCourses.map((course) => course.name).join(', ')}.`
        : `${employee.name} has no overdue courses right now.`,
      recommendedActions: overdueCourses.length > 0
        ? ['Follow up on overdue courses immediately.', 'Confirm whether workload or access issues are blocking completion.']
        : ['Keep the current learning plan on track.']
    };
  }

  if (normalizedQuestion.includes('next') && normalizedQuestion.includes('review')) {
    return {
      answer: `${employee.name}'s next review date is ${formatDate(employee.performance.nextReviewDate)}. The current rating is ${employee.performance.rating?.replace('_', ' ') ?? 'not recorded'}.`,
      recommendedActions: ['Prepare discussion points for the next review.', 'Align current goals to expected review outcomes.']
    };
  }

  if (normalizedQuestion.includes('learning') || normalizedQuestion.includes('course')) {
    return {
      answer: `${employee.name} has completed ${employee.learning.completedCourses} of ${employee.learning.enrolledCourses} learning items. ${inProgressCourses.length > 0 ? `Currently in progress: ${inProgressCourses.map((course) => course.name).join(', ')}.` : 'No courses are currently in progress.'}`,
      recommendedActions: buildRecommendedActions(employee)
    };
  }

  if (normalizedQuestion.includes('risk') || normalizedQuestion.includes('attention')) {
    return {
      answer: `${buildRiskAnalysis(employee)} ${overdueWorkflows.length > 0 ? `Overdue workflows: ${overdueWorkflows.map((workflow) => workflow.name).join(', ')}.` : ''}`.trim(),
      recommendedActions: buildRecommendedActions(employee)
    };
  }

  return {
    answer: buildSummary(employee),
    recommendedActions: buildRecommendedActions(employee)
  };
};

const callOpenAI = async (systemPrompt: string, userPrompt: string) => {
  if (!openAIClient) {
    return null;
  }

  const response = await openAIClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.4
  });

  return response.choices[0]?.message?.content?.trim() ?? null;
};

export const generateJourneySummary = async (employee: Employee) => {
  const mock = getMockEmployeeInsights(employee);

  const aiResponse = await callOpenAI(
    'You are an HR analytics copilot. Return a concise manager-ready employee journey summary in 3-4 sentences.',
    `Employee data: ${JSON.stringify(employee)}`
  ).catch(() => null);

  return aiResponse ?? mock.summary;
};

export const generateInsights = async (employee: Employee): Promise<EmployeeInsightPayload> => {
  const mock = getMockEmployeeInsights(employee);

  const aiResponse = await callOpenAI(
    'You are an HR analytics copilot. Given employee JSON, return JSON with keys summary, riskAnalysis, recommendedActions, keyHighlights.',
    `Employee data: ${JSON.stringify(employee)}`
  ).catch(() => null);

  if (!aiResponse) {
    return mock;
  }

  try {
    const parsed = JSON.parse(aiResponse) as EmployeeInsightPayload;
    return {
      summary: parsed.summary ?? mock.summary,
      riskAnalysis: parsed.riskAnalysis ?? mock.riskAnalysis,
      recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : mock.recommendedActions,
      keyHighlights: Array.isArray(parsed.keyHighlights) && parsed.keyHighlights.length > 0 ? parsed.keyHighlights : mock.keyHighlights
    };
  } catch {
    return mock;
  }
};

export const askEmployeeQuestion = async (question: string, employeeId?: string, managerId?: string): Promise<AskResponse> => {
  const employee = employeeId ? getEmployeeById(employeeId) : undefined;

  if (!employee) {
    const mockResponse = getTeamAskResponse(question, managerId);
    const aiResponse = await callOpenAI(
      'You are an HR analytics copilot. Answer manager questions about team journey data in JSON with keys answer and recommendedActions.',
      `Question: ${question}\nTeam data: ${JSON.stringify(getEmployeesForManager(managerId))}`
    ).catch(() => null);

    if (!aiResponse) {
      return mockResponse;
    }

    try {
      const parsed = JSON.parse(aiResponse) as AskResponse;
      return {
        answer: parsed.answer ?? mockResponse.answer,
        recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : mockResponse.recommendedActions
      };
    } catch {
      return mockResponse;
    }
  }

  const mockResponse = getEmployeeAskResponse(employee, question);
  const aiResponse = await callOpenAI(
    'You are an HR analytics copilot. Answer manager questions about employee journey data in JSON with keys answer and recommendedActions.',
    `Question: ${question}\nEmployee data: ${JSON.stringify(employee)}`
  ).catch(() => null);

  if (!aiResponse) {
    return mockResponse;
  }

  try {
    const parsed = JSON.parse(aiResponse) as AskResponse;
    return {
      answer: parsed.answer ?? mockResponse.answer,
      recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : mockResponse.recommendedActions
    };
  } catch {
    return mockResponse;
  }
};

// ─── Pending hire insights ────────────────────────────────────────────────────

interface PendingHireInsights {
  summary: string;
  preparationStatus: string;
  recommendedActions: string[];
  keyHighlights: string[];
}

const buildPendingHireSummary = (pending: PendingEmployee): string => {
  const startDate = formatDate(pending.expectedStartDate);
  const daysUntilStart = Math.ceil((new Date(pending.expectedStartDate).getTime() - Date.now()) / 86_400_000);
  const daysLabel = daysUntilStart > 0 ? `in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}` : 'today';
  const pendingTasks = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed);
  const blockers = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(pending.expectedStartDate));

  return `${pending.name} is joining as ${pending.intendedRole} in ${pending.department} on ${startDate} (${daysLabel}). ` +
    `Their pre-boarding workflow is ${pending.preBoardingWorkflow.progress}% complete — ` +
    `${pending.preBoardingWorkflow.completedTasks} of ${pending.preBoardingWorkflow.totalTasks} tasks done. ` +
    (pendingTasks.length > 0
      ? `${pendingTasks.length} task${pendingTasks.length !== 1 ? 's' : ''} remain${pendingTasks.length === 1 ? 's' : ''} before their start date.`
      : 'All pre-boarding tasks are on track.') +
    (blockers.length > 0 ? ` ${blockers.length} item${blockers.length !== 1 ? 's' : ''} may need escalation to stay on schedule.` : '');
};

const buildPendingHirePreparationStatus = (pending: PendingEmployee): string => {
  const ownerGroups: Record<string, string[]> = { manager: [], hr: [], it: [], candidate: [] };
  for (const task of pending.preBoardingWorkflow.tasks.filter((t) => !t.completed)) {
    ownerGroups[task.owner]?.push(task.name);
  }

  const parts: string[] = [];
  if (ownerGroups.manager.length) parts.push(`Manager actions pending: ${ownerGroups.manager.join(', ')}`);
  if (ownerGroups.hr.length) parts.push(`HR actions pending: ${ownerGroups.hr.join(', ')}`);
  if (ownerGroups.it.length) parts.push(`IT actions pending: ${ownerGroups.it.join(', ')}`);
  if (ownerGroups.candidate.length) parts.push(`Candidate actions pending: ${ownerGroups.candidate.join(', ')}`);

  return parts.length > 0 ? parts.join('. ') + '.' : 'No outstanding actions — all pre-boarding steps are complete.';
};

const buildPendingHireRecommendedActions = (pending: PendingEmployee): string[] => {
  const actions = new Set<string>();
  const daysUntilStart = Math.ceil((new Date(pending.expectedStartDate).getTime() - Date.now()) / 86_400_000);

  const managerTasks = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed && t.owner === 'manager');
  if (managerTasks.length > 0) actions.add(`Complete your ${managerTasks.length} manager pre-boarding task(s): ${managerTasks.map((t) => t.name).join(', ')}.`);

  const itTasks = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed && t.owner === 'it');
  if (itTasks.length > 0) actions.add(`Follow up with IT on ${itTasks.length} pending task(s) to ensure Day 1 readiness.`);

  const hrTasks = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed && t.owner === 'hr');
  if (hrTasks.length > 0) actions.add(`Confirm HR has progressed: ${hrTasks.map((t) => t.name).join(', ')}.`);

  if (daysUntilStart <= 7) actions.add('Start date is within one week — confirm all critical pre-boarding steps are complete.');
  if (daysUntilStart <= 14 && daysUntilStart > 7) actions.add('Start date is within two weeks — escalate any blocked items now.');

  if (!pending.preBoardingWorkflow.tasks.find((t) => t.name.toLowerCase().includes('buddy') && t.completed)) {
    actions.add("Assign a learning buddy before the candidate's start date to accelerate onboarding ramp.");
  }

  if (actions.size === 0) actions.add('Pre-boarding is well on track. Send a personalised welcome message to the candidate.');

  return Array.from(actions).slice(0, 4);
};

const buildPendingHireHighlights = (pending: PendingEmployee): string[] => {
  const daysUntilStart = Math.ceil((new Date(pending.expectedStartDate).getTime() - Date.now()) / 86_400_000);
  const ownerCounts = pending.preBoardingWorkflow.tasks
    .filter((t) => !t.completed)
    .reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.owner]: (acc[t.owner] ?? 0) + 1 }), {});

  return [
    `Joining as ${pending.intendedRole} on ${formatDate(pending.expectedStartDate)} (${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''})`,
    `Pre-boarding workflow: ${pending.preBoardingWorkflow.progress}% complete (${pending.preBoardingWorkflow.completedTasks}/${pending.preBoardingWorkflow.totalTasks} tasks)`,
    ...Object.entries(ownerCounts).map(([owner, count]) => `${count} task${count !== 1 ? 's' : ''} pending with ${owner.toUpperCase()}`),
    ...(pending.notes ? [`Note: ${pending.notes}`] : [])
  ].slice(0, 4);
};

export const generatePendingHireInsights = async (pending: PendingEmployee): Promise<PendingHireInsights> => {
  const mock: PendingHireInsights = {
    summary: buildPendingHireSummary(pending),
    preparationStatus: buildPendingHirePreparationStatus(pending),
    recommendedActions: buildPendingHireRecommendedActions(pending),
    keyHighlights: buildPendingHireHighlights(pending)
  };

  const aiResponse = await callOpenAI(
    'You are an HR analytics copilot. Given a pending hire pre-boarding workflow, return JSON with keys summary, preparationStatus, recommendedActions (array), keyHighlights (array).',
    `Pending hire data: ${JSON.stringify(pending)}`
  ).catch(() => null);

  if (!aiResponse) return mock;

  try {
    const parsed = JSON.parse(aiResponse) as PendingHireInsights;
    return {
      summary: parsed.summary ?? mock.summary,
      preparationStatus: parsed.preparationStatus ?? mock.preparationStatus,
      recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0 ? parsed.recommendedActions : mock.recommendedActions,
      keyHighlights: Array.isArray(parsed.keyHighlights) && parsed.keyHighlights.length > 0 ? parsed.keyHighlights : mock.keyHighlights
    };
  } catch {
    return mock;
  }
};
