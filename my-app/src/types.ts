export type SimpleTask = {
  id: number;
  title: string;
  points: number;
  type: "simple";
  completed: boolean;
  earnedPoints?: number;
};

export type RepeatableTask = {
  id: number;
  title: string;
  points: number;
  type: "repeatable";
  requiredCount: number;
  currentCount: number;
  cooldown: number;
  lastCompleted: number | null;
  timeRemaining: number;
  earnedPoints?: number;
};

export type Task = SimpleTask | RepeatableTask;


export type HistoryEntry = {
  date: string;
  points: number;
  tasks: string[];
};