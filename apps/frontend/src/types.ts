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

export interface PreBoardingTask {
  name: string;
  owner: 'manager' | 'hr' | 'it' | 'candidate';
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

export interface PendingEmployee {
  id: string;
  workflowId: string;
  name: string;
  intendedRole: string;
  department: string;
  manager: string;
  avatar: string;
  expectedStartDate: string;
  offerAcceptedDate: string;
  candidateEmail: string;
  status: 'pre_boarding';
  preBoardingWorkflow: {
    name: string;
    progress: number;
    completedTasks: number;
    totalTasks: number;
    tasks: PreBoardingTask[];
  };
  notes?: string;
}

export interface PendingHireInsights {
  summary: string;
  preparationStatus: string;
  recommendedActions: string[];
  keyHighlights: string[];
}

export interface AIInsights {
  summary: string;
  riskAnalysis: string;
  recommendedActions: string[];
  keyHighlights: string[];
}

export interface AskAIResponse {
  answer: string;
  recommendedActions: string[];
}
