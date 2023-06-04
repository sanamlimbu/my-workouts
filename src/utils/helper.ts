import { Timestamp } from "firebase/firestore";
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

/**
 * Retrieves unique workout types from an array of workouts.
 * @param workouts An array of workouts.
 * @returns A Set containing unique workout types.
 */
export function getWorkoutTypes(workouts: Workout[]): Set<string> {
  const workoutTypes = new Set<string>();
  workouts.map((workout) => {
    workoutTypes.add(workout.type);
  });
  return workoutTypes;
}

/**
 * Converts a Firestore timestamp object to a string representation.
 * @param timestamp The Firestore timestamp object to convert.
 * @returns The string representation of the timestamp.
 */
export function convertFirestoreTimestampToString(
  timestamp: Timestamp
): string {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${period} - ${dayName}, ${day} ${
    monthNames[monthIndex]
  } ${year}`;

  return formattedDate;
}

/**
 * Calculates the duration between a start and finish timestamp and returns the duration in the format "H hours M minutes".
 * @param startTimestamp The start timestamp.
 * @param finishTimestamp The finish timestamp.
 * @returns The duration between the timestamps in the format "H hours M minutes".
 */
export function calculateWorkoutDuration(
  startTimestamp: Timestamp,
  finishTimestamp: Timestamp
): string {
  const durationInMillis =
    finishTimestamp.seconds * 1000 +
    finishTimestamp.nanoseconds / 1000000 -
    (startTimestamp.seconds * 1000 + startTimestamp.nanoseconds / 1000000);

  // Calculate the duration in minutes
  const durationInMinutes = Math.floor(durationInMillis / (1000 * 60));

  if (durationInMinutes < 60) {
    return `${durationInMinutes} mins`;
  }

  // Calculate the hours and minutes from the duration in minutes
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  const formattedDuration =
    hours > 1 ? `${hours} hrs ${minutes} mins` : `${hours} hr ${minutes} mins`;

  return formattedDuration;
}
