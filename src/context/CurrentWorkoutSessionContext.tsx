import { QueryDocumentSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentWorkoutSessionQueryDocSnapshot } from "../api/firebase";
import Loading from "../components/loading";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the current workout session from Firebase
    (async () => {
      try {
        if (currentUser) {
          const workoutSessionQueryDocSnapshot =
            await fetchCurrentWorkoutSessionQueryDocSnapshot(currentUser.uid);
          setCurrentWorkoutSession(workoutSessionQueryDocSnapshot);
          setIsLoading(false);
        }
      } catch (error: any) {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <CurrentWorkoutSessionContext.Provider
      value={{
        currentWorkoutSession,
        setCurrentWorkoutSession,
      }}
    >
      {isLoading ? <Loading /> : props.children}
    </CurrentWorkoutSessionContext.Provider>
  );
};

export { CurrentWorkoutSessionContext, CurrentWorkoutSessionProvider };
