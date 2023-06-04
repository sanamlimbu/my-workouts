import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
      where("completedAt", "==", null),
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
export const createWorkoutSession = async (
  userId: string
): Promise<QueryDocumentSnapshot<WorkoutSession>> => {
  try {
    const workoutSessionsRef = collection(db, "workoutSessions");

    const newWorkoutSession = {
      userId,
      createdAt: serverTimestamp(),
      completedAt: null,
      workouts: [],
    };

    const docRef = await addDoc(workoutSessionsRef, newWorkoutSession);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot as QueryDocumentSnapshot<WorkoutSession>;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches previous workout session query document snapshots from Firestore.
 *
 * @param userId The ID of the user for whom the workout sessions are fetched.
 * @param count (Optional) The number of workout sessions to fetch. Defaults to 2 if not provided.
 * @returns A promise that resolves to an array of query document snapshots of type `QueryDocumentSnapshot<WorkoutSession>`.
 * @throws If no documents are found.
 */
export const fetchPreviousWorkoutSessionQueryDocSnapshot = async (
  userId: string,
  count?: number
): Promise<QueryDocumentSnapshot<WorkoutSession>[]> => {
  const _count = count ? count : 2;
  try {
    const q = query(
      collection(db, "workoutSessions"),
      where("userId", "==", userId),
      where("completedAt", "!=", null),
      orderBy("completedAt", "desc"),
      limit(_count)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const queryDocumentSnapshot = querySnapshot.docs;
      return queryDocumentSnapshot as QueryDocumentSnapshot<WorkoutSession>[];
    } else {
      throw new Error("No documents found");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Ends a workout session by updating the `completedAt` field in Firestore.
 * @param sessionId The ID of the workout session to end.
 * @returns A promise that resolves when the workout session is successfully ended.
 * @throws If an error occurs during the update.
 */
export const endWorkoutSession = async (sessionId: string): Promise<void> => {
  try {
    const workoutSessionRef = doc(db, "workoutSessions", sessionId);

    await updateDoc(workoutSessionRef, {
      completedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a workout session in Firestore.
 * @param sessionId The ID of the workout session to end.
 * @returns A promise that resolves when the workout session is successfully deleted.
 * @throws If an error occurs during the deletion.
 */
export const deleteWorkoutSession = async (
  sessionId: string
): Promise<void> => {
  try {
    const workoutSessionRef = doc(db, "workoutSessions", sessionId);
    await deleteDoc(workoutSessionRef);
  } catch (error) {
    throw error;
  }
};
