export interface Habit {
  id: string;
  name: string;
  description: string;
  emoji: string;
  completed: boolean;
  frequency: string;
  target: string;
  createdAt: Date;
  completedDates: Date[];
}

export type RootStackParamList = {
  Home: undefined;
  Statistics: undefined;
  CreateHabit: undefined;
};