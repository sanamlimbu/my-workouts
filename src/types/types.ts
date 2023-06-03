import { DocumentData, Timestamp } from "firebase/firestore";

export interface WorkoutSession extends DocumentData {
  userId: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  workouts: Workout[];
}

export interface Workout {
  id: string;
  type: string;
  name: string;
  weight: number;
  reps: number;
}

export enum WorkoutType {
  Back = "Back",
  Biceps = "Biceps",
  Chest = "Chest",
  Legs = "Legs",
  Shoulder = "Shoulder",
  Triceps = "Triceps",
}
