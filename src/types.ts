export enum WorkoutType {
  Back = "Back",
  Biceps = "Biceps",
  Chest = "Chest",
  Legs = "Leg",
  Shoulder = "Shoulder",
  Triceps = "Triceps",
}

export interface Workout {
  name: string;
  type: WorkoutType;
}
