import {
  BackWorkouts,
  BicepWorkouts,
  ChestWorkouts,
  LegWorkouts,
  ShoulderWorkouts,
  TricepWorkouts,
} from "../constant";
import { Workout, WorkoutType } from "../types/types";

/**
 * Extracts the first name from a full name.
 *
 * @param fullName The full name from which to extract the first name.
 * @returns The first name extracted from the full name.
 */
export function getFirstName(fullName: string): string {
  const firstName = fullName.split(" ")[0];
  return firstName;
}

/**
 * Retrieves an array of workouts based on the specified workout type.
 * @param workoutType - The workout type to retrieve the workouts for.
 * @returns An array of workouts corresponding to the specified workout type.
 */
export function getWorkoutsByType(workoutType: WorkoutType): string[] {
  switch (workoutType) {
    case WorkoutType.Back: {
      return BackWorkouts;
    }
    case WorkoutType.Biceps: {
      return BicepWorkouts;
    }
    case WorkoutType.Chest: {
      return ChestWorkouts;
    }
    case WorkoutType.Legs: {
      return LegWorkouts;
    }
    case WorkoutType.Shoulder: {
      return ShoulderWorkouts;
    }
    case WorkoutType.Triceps: {
      return TricepWorkouts;
    }
    default: {
      return [];
    }
  }
}

/**
 * Groups an array of workouts by exercise name.
 * @param workouts An array of workouts to be grouped.
 * @returns An object where keys are exercise names and values are arrays of workouts grouped by name.
 */
export function groupWorkoutsByName(workouts: Workout[]): {
  [name: string]: Workout[];
} {
  const groupedWorkouts: { [name: string]: Workout[] } = {};

  workouts.forEach((workout) => {
    const { name } = workout;
    if (groupedWorkouts[name]) {
      groupedWorkouts[name].push(workout);
    } else {
      groupedWorkouts[name] = [workout];
    }
  });

  return groupedWorkouts;
}
