import { Box, Typography } from "@mui/material";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { fetchPreviousWorkoutSessionQueryDocSnapshot } from "../api/firebase";
import { AuthContext } from "../context/AuthContext";
import { CurrentWorkoutSessionContext } from "../context/CurrentWorkoutSessionContext";
import { WorkoutSession } from "../types/types";
import WorkoutSessionSection from "./workoutSession";

export default function PreviousWorkoutSessions() {
  const { currentUser } = useContext(AuthContext);
  const { currentWorkoutSession } = useContext(CurrentWorkoutSessionContext);
  const [previousWorkoutSessions, setPreviousWorkoutSessions] =
    useState<QueryDocumentSnapshot<WorkoutSession>[]>();
  useEffect(() => {
    (async () => {
      try {
        if (currentUser) {
          const count = 5;
          const result = await fetchPreviousWorkoutSessionQueryDocSnapshot(
            currentUser.uid,
            count
          );
          setPreviousWorkoutSessions(result);
        }
      } catch (error: any) {}
    })();
  }, [currentWorkoutSession]);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          marginTop: "1em",
          fontWeight: "bold",
          background: "linear-gradient(to right, #007FFF, #0059B2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Previous sessions
      </Typography>
      <Box>
        {previousWorkoutSessions ? (
          previousWorkoutSessions.map((doc) => {
            return <WorkoutSessionSection doc={doc} key={doc.id} />;
          })
        ) : (
          <Typography> No sessions found</Typography>
        )}
      </Box>
    </Box>
  );
}
