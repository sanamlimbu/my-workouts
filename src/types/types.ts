import { DocumentData } from "firebase/firestore";

export interface WorkoutSession extends DocumentData {
  userId: string;
  createdAt: Date;
  completedAt?: Date;
  workouts: Workout[];
}

export interface Workout {
  type: string;
  name: string;
  set: number;
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
