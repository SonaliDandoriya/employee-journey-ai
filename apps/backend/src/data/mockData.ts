export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  manager: string;
  avatar: string;
  hireDate: string;
  status: 'active' | 'onboarding' | 'offboarding';
  onboarding: {
    status: 'completed' | 'in_progress' | 'not_started';
    progress: number;
    completedTasks: number;
    totalTasks: number;
    dueDate: string;
    tasks: Array<{ name: string; completed: boolean; dueDate?: string }>;
  };
  learning: {
    enrolledCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    overdueCourses: number;
    courses: Array<{
      name: string;
      status: 'completed' | 'in_progress' | 'overdue' | 'not_started';
      progress: number;
      dueDate?: string;
      completedDate?: string;
    }>;
  };
  workflows: Array<{
    name: string;
    type: 'onboarding' | 'performance' | 'feedback' | 'offboarding' | 'compliance';
    status: 'completed' | 'in_progress' | 'pending' | 'overdue';
    progress: number;
    dueDate?: string;
  }>;
  feedback: {
    given: number;
    received: number;
    lastFeedbackDate?: string;
    sentiment: 'positive' | 'neutral' | 'needs_attention';
  };
  performance: {
    lastReviewDate?: string;
    nextReviewDate?: string;
    rating?: 'exceeds' | 'meets' | 'below' | 'not_reviewed';
    goals: Array<{ name: string; progress: number; status: 'on_track' | 'at_risk' | 'completed' }>;
  };
  riskScore: number;
}

type EmployeeRecord = Employee & { managerId: string };

export const employees: EmployeeRecord[] = [
  {
    id: 'emp-1001',
    managerId: 'mgr-001',
    name: 'Emma Rodriguez',
    role: 'People Operations Specialist',
    department: 'People & Culture',
    manager: 'Alex Morgan',
    avatar: 'ER',
    hireDate: '2026-05-28',
    status: 'onboarding',
    onboarding: {
      status: 'in_progress',
      progress: 45,
      completedTasks: 5,
      totalTasks: 11,
      dueDate: '2026-06-28',
      tasks: [
        { name: 'Signed employment agreement', completed: true },
        { name: 'Submitted payroll information', completed: true },
        { name: 'Completed HR orientation', completed: true },
        { name: 'IT equipment received', completed: true },
        { name: 'Manager welcome check-in', completed: true },
        { name: 'Benefits enrollment', completed: false, dueDate: '2026-06-14' },
        { name: 'Security awareness training', completed: false, dueDate: '2026-06-16' },
        { name: 'Meet assigned learning buddy', completed: false, dueDate: '2026-06-17' },
        { name: 'Role expectations workshop', completed: false, dueDate: '2026-06-19' },
        { name: 'First 30-day goal plan', completed: false, dueDate: '2026-06-24' },
        { name: 'Onboarding feedback survey', completed: false, dueDate: '2026-06-28' }
      ]
    },
    learning: {
      enrolledCourses: 4,
      completedCourses: 0,
      inProgressCourses: 3,
      overdueCourses: 0,
      courses: [
        { name: 'Welcome to CatalystOne', status: 'in_progress', progress: 60, dueDate: '2026-06-15' },
        { name: 'HR Systems Foundations', status: 'in_progress', progress: 40, dueDate: '2026-06-20' },
        { name: 'Security Awareness Essentials', status: 'in_progress', progress: 20, dueDate: '2026-06-16' },
        { name: 'Feedback Culture Basics', status: 'not_started', progress: 0, dueDate: '2026-06-25' }
      ]
    },
    workflows: [
      { name: 'New Hire Setup', type: 'onboarding', status: 'in_progress', progress: 55, dueDate: '2026-06-18' },
      { name: '30-Day Check-In', type: 'feedback', status: 'pending', progress: 0, dueDate: '2026-06-26' },
      { name: 'Compliance Acknowledgement', type: 'compliance', status: 'in_progress', progress: 35, dueDate: '2026-06-16' }
    ],
    feedback: {
      given: 1,
      received: 2,
      lastFeedbackDate: '2026-06-09',
      sentiment: 'positive'
    },
    performance: {
      nextReviewDate: '2026-08-28',
      rating: 'not_reviewed',
      goals: [
        { name: 'Complete onboarding ramp plan', progress: 45, status: 'on_track' },
        { name: 'Shadow two employee lifecycle cases', progress: 30, status: 'on_track' }
      ]
    },
    riskScore: 25
  },
  {
    id: 'emp-1002',
    managerId: 'mgr-001',
    name: 'James Mitchell',
    role: 'HR Business Partner',
    department: 'People & Culture',
    manager: 'Alex Morgan',
    avatar: 'JM',
    hireDate: '2025-10-02',
    status: 'active',
    onboarding: {
      status: 'completed',
      progress: 100,
      completedTasks: 12,
      totalTasks: 12,
      dueDate: '2025-11-15',
      tasks: [
        { name: 'All onboarding tasks completed', completed: true },
        { name: '30-60-90 day plan signed off', completed: true },
        { name: 'Manager probation review', completed: true }
      ]
    },
    learning: {
      enrolledCourses: 5,
      completedCourses: 3,
      inProgressCourses: 1,
      overdueCourses: 1,
      courses: [
        { name: 'Inclusive Leadership', status: 'completed', progress: 100, completedDate: '2026-02-20' },
        { name: 'Advanced Employee Relations', status: 'completed', progress: 100, completedDate: '2026-03-18' },
        { name: 'Performance Calibration', status: 'completed', progress: 100, completedDate: '2026-04-02' },
        { name: 'GDPR for Managers', status: 'overdue', progress: 70, dueDate: '2026-05-30' },
        { name: 'Strategic Workforce Planning', status: 'in_progress', progress: 55, dueDate: '2026-06-21' }
      ]
    },
    workflows: [
      { name: 'Mid-Year Review Prep', type: 'performance', status: 'in_progress', progress: 65, dueDate: '2026-06-30' },
      { name: 'Feedback Pulse', type: 'feedback', status: 'completed', progress: 100, dueDate: '2026-05-22' },
      { name: 'Compliance Refresh', type: 'compliance', status: 'overdue', progress: 70, dueDate: '2026-05-30' }
    ],
    feedback: {
      given: 8,
      received: 6,
      lastFeedbackDate: '2026-06-01',
      sentiment: 'neutral'
    },
    performance: {
      lastReviewDate: '2025-12-15',
      nextReviewDate: '2026-06-25',
      rating: 'meets',
      goals: [
        { name: 'Improve manager coaching cadence', progress: 72, status: 'on_track' },
        { name: 'Launch retention playbook', progress: 50, status: 'at_risk' },
        { name: 'Reduce time-to-resolution for HR cases', progress: 80, status: 'on_track' }
      ]
    },
    riskScore: 65
  },
  {
    id: 'emp-1003',
    managerId: 'mgr-001',
    name: 'Priya Patel',
    role: 'Senior Learning Consultant',
    department: 'Learning & Development',
    manager: 'Alex Morgan',
    avatar: 'PP',
    hireDate: '2024-05-14',
    status: 'active',
    onboarding: {
      status: 'completed',
      progress: 100,
      completedTasks: 14,
      totalTasks: 14,
      dueDate: '2024-06-30',
      tasks: [
        { name: 'Onboarding completed', completed: true },
        { name: 'Career plan approved', completed: true },
        { name: 'Mentor programme joined', completed: true }
      ]
    },
    learning: {
      enrolledCourses: 6,
      completedCourses: 6,
      inProgressCourses: 0,
      overdueCourses: 0,
      courses: [
        { name: 'AI for Learning Leaders', status: 'completed', progress: 100, completedDate: '2026-01-12' },
        { name: 'Coaching for High Potentials', status: 'completed', progress: 100, completedDate: '2025-12-08' },
        { name: 'Data Storytelling', status: 'completed', progress: 100, completedDate: '2026-02-04' },
        { name: 'Facilitation Masterclass', status: 'completed', progress: 100, completedDate: '2026-03-21' },
        { name: 'Compliance Essentials', status: 'completed', progress: 100, completedDate: '2026-04-03' },
        { name: 'Leadership Pathways', status: 'completed', progress: 100, completedDate: '2026-05-11' }
      ]
    },
    workflows: [
      { name: 'Quarterly Talent Review', type: 'performance', status: 'completed', progress: 100, dueDate: '2026-05-28' },
      { name: 'Mentor Programme Feedback', type: 'feedback', status: 'completed', progress: 100, dueDate: '2026-05-15' },
      { name: 'Learning Catalogue Refresh', type: 'compliance', status: 'completed', progress: 100, dueDate: '2026-04-30' }
    ],
    feedback: {
      given: 14,
      received: 11,
      lastFeedbackDate: '2026-06-05',
      sentiment: 'positive'
    },
    performance: {
      lastReviewDate: '2026-03-10',
      nextReviewDate: '2026-09-10',
      rating: 'exceeds',
      goals: [
        { name: 'Launch manager academy pilot', progress: 90, status: 'on_track' },
        { name: 'Increase learning completion rates by 12%', progress: 100, status: 'completed' },
        { name: 'Build AI-powered content recommendations', progress: 75, status: 'on_track' }
      ]
    },
    riskScore: 10
  },
  {
    id: 'emp-1004',
    managerId: 'mgr-001',
    name: 'David Chen',
    role: 'People Analytics Specialist',
    department: 'People Analytics',
    manager: 'Alex Morgan',
    avatar: 'DC',
    hireDate: '2025-12-01',
    status: 'active',
    onboarding: {
      status: 'completed',
      progress: 100,
      completedTasks: 10,
      totalTasks: 10,
      dueDate: '2026-01-15',
      tasks: [
        { name: 'Onboarding completed', completed: true },
        { name: 'Data access approved', completed: true },
        { name: 'Analytics playbook review', completed: true }
      ]
    },
    learning: {
      enrolledCourses: 5,
      completedCourses: 2,
      inProgressCourses: 1,
      overdueCourses: 2,
      courses: [
        { name: 'People Data Governance', status: 'completed', progress: 100, completedDate: '2026-02-11' },
        { name: 'SQL for HR Analytics', status: 'completed', progress: 100, completedDate: '2026-03-17' },
        { name: 'Workday Reporting', status: 'in_progress', progress: 45, dueDate: '2026-06-18' },
        { name: 'Mandatory Compliance 2026', status: 'overdue', progress: 20, dueDate: '2026-05-20' },
        { name: 'Manager Self-Service Audit', status: 'overdue', progress: 10, dueDate: '2026-05-28' }
      ]
    },
    workflows: [
      { name: 'Mid-Year Review Submission', type: 'performance', status: 'overdue', progress: 40, dueDate: '2026-05-31' },
      { name: '360 Feedback Follow-Up', type: 'feedback', status: 'pending', progress: 0, dueDate: '2026-06-14' },
      { name: 'Compliance Remediation', type: 'compliance', status: 'overdue', progress: 25, dueDate: '2026-05-25' }
    ],
    feedback: {
      given: 2,
      received: 3,
      lastFeedbackDate: '2026-04-22',
      sentiment: 'needs_attention'
    },
    performance: {
      lastReviewDate: '2025-12-20',
      nextReviewDate: '2026-05-31',
      rating: 'below',
      goals: [
        { name: 'Automate monthly people metrics dashboard', progress: 40, status: 'at_risk' },
        { name: 'Improve data quality exception rate', progress: 55, status: 'at_risk' },
        { name: 'Deliver attrition insights pack', progress: 35, status: 'at_risk' }
      ]
    },
    riskScore: 78
  },
  {
    id: 'emp-1005',
    managerId: 'mgr-001',
    name: 'Sofia Andersson',
    role: 'Compensation Analyst',
    department: 'Rewards',
    manager: 'Alex Morgan',
    avatar: 'SA',
    hireDate: '2025-06-06',
    status: 'offboarding',
    onboarding: {
      status: 'completed',
      progress: 100,
      completedTasks: 9,
      totalTasks: 9,
      dueDate: '2025-07-10',
      tasks: [
        { name: 'Onboarding completed', completed: true },
        { name: 'Systems access configured', completed: true },
        { name: 'Probation confirmed', completed: true }
      ]
    },
    learning: {
      enrolledCourses: 4,
      completedCourses: 3,
      inProgressCourses: 1,
      overdueCourses: 0,
      courses: [
        { name: 'Compensation Foundations', status: 'completed', progress: 100, completedDate: '2025-08-02' },
        { name: 'Reward Benchmarking', status: 'completed', progress: 100, completedDate: '2025-10-11' },
        { name: 'Compliance Essentials', status: 'completed', progress: 100, completedDate: '2026-01-09' },
        { name: 'Knowledge Transfer Planning', status: 'in_progress', progress: 65, dueDate: '2026-06-20' }
      ]
    },
    workflows: [
      { name: 'Offboarding Checklist', type: 'offboarding', status: 'in_progress', progress: 60, dueDate: '2026-06-24' },
      { name: 'Access Removal', type: 'compliance', status: 'pending', progress: 0, dueDate: '2026-06-22' },
      { name: 'Knowledge Handover', type: 'feedback', status: 'in_progress', progress: 70, dueDate: '2026-06-21' }
    ],
    feedback: {
      given: 5,
      received: 7,
      lastFeedbackDate: '2026-05-29',
      sentiment: 'neutral'
    },
    performance: {
      lastReviewDate: '2026-02-18',
      nextReviewDate: '2026-08-18',
      rating: 'meets',
      goals: [
        { name: 'Complete compensation review cycle', progress: 100, status: 'completed' },
        { name: 'Document reward process handover', progress: 70, status: 'on_track' }
      ]
    },
    riskScore: 30
  }
];

export const getEmployeesForManager = (managerId?: string): Employee[] => {
  const filtered = managerId ? employees.filter((employee) => employee.managerId === managerId) : employees;
  return filtered.map(({ managerId: _managerId, ...employee }) => employee);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const record = employees.find((employee) => employee.id === id);
  if (!record) {
    return undefined;
  }

  const { managerId: _managerId, ...employee } = record;
  return employee;
};
