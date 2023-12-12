export type Objective = {
  name: string;
  displayName: string;
  burnRate: number;
  errorBudgetRemaining: number;
  errorBudgetRemainingPercentage: number;
  target: number;
};

export type Composite = {
  burnRate: number;
  errorBudgetRemaining: number;
  errorBudgetRemainingPercentage: number;
  target: number;
};

export type Slo = {
  name: string;
  displayName: string;
  description: string;
  createdAt: string;
  project: string;
  objectives: Objective[];
  labels: Record<string, string[]>;
  composite: Composite;
};

export type N9BackendResponse = Record<string, Slo[]>;
