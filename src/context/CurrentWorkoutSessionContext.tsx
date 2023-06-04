import { QueryDocumentSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentWorkoutSessionQueryDocSnapshot } from "../api/firebase";
import { WorkoutSession } from "../types/types";
import { AuthContext } from "./AuthContext";

interface ICurrentWorkoutSessionContext {
  currentWorkoutSession: QueryDocumentSnapshot<WorkoutSession> | undefined;
  setCurrentWorkoutSession: React.Dispatch<
    React.SetStateAction<QueryDocumentSnapshot<WorkoutSession> | undefined>
  >;
}
const CurrentWorkoutSessionContext =
  createContext<ICurrentWorkoutSessionContext>(
    {} as ICurrentWorkoutSessionContext
  );

const CurrentWorkoutSessionProvider = (props: {
  children: React.ReactNode;
}) => {
  const [currentWorkoutSession, setCurrentWorkoutSession] =
    useState<QueryDocumentSnapshot<WorkoutSession>>();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the current workout session from Firebase
    (async () => {
      try {
        if (currentUser) {
          const workoutSessionQueryDocSnapshot =
            await fetchCurrentWorkoutSessionQueryDocSnapshot(currentUser.uid);
          setCurrentWorkoutSession(workoutSessionQueryDocSnapshot);
        }
      } catch (error: any) {}
    })();
  }, []);

  return (
    <CurrentWorkoutSessionContext.Provider
      value={{
        currentWorkoutSession,
        setCurrentWorkoutSession,
      }}
    >
      {props.children}
    </CurrentWorkoutSessionContext.Provider>
  );
};

export { CurrentWorkoutSessionContext, CurrentWorkoutSessionProvider };
