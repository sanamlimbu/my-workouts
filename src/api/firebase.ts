import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { WorkoutSession } from "../types/types";

/**
 * Fetches the current workout session document for a given user ID.
 * @param userId The ID of the user.
 * @returns The data of the latest workout session document.
 * @throws If no documents are found or an error occurs during the fetch.
 */
export const fetchCurrentWorkoutSessionQueryDocSnapshot = async (
  userId: string
): Promise<QueryDocumentSnapshot<WorkoutSession>> => {
  try {
    const q = query(
      collection(db, "workoutSessions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const queryDocumentSnapshot = querySnapshot.docs[0];
      return queryDocumentSnapshot as QueryDocumentSnapshot<WorkoutSession>;
    } else {
      throw new Error("No documents found");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new workout session document in Firestore.
 * @param db The Firestore instance.
 * @param userId The ID of the user associated with the workout session.
 * @returns The ID of the newly created workout session document.
 * @throws If an error occurs during the creation.
 */
export const createWorkoutSession = async (userId: string): Promise<string> => {
  try {
    const workoutSessionsRef = collection(db, "workoutSessions");

    const newWorkoutSession = {
      userId,
      createdAt: serverTimestamp(),
      completedAt: null,
      workouts: [],
    };

    const docRef = await addDoc(workoutSessionsRef, newWorkoutSession);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
