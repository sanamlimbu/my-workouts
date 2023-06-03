import { Avatar, Box, Button, Typography } from "@mui/material";
import red from "@mui/material/colors/red";
import { useContext, useState } from "react";

import { signOut } from "firebase/auth";
import { createWorkoutSession } from "../api/firebase";
import CurrentWorkoutSession from "../components/currentWorkoutSession";
import PreviousWorkoutSessions from "../components/previousWorkoutSessions";
import { AuthContext } from "../context/AuthContext";
import { CurrentWorkoutSessionContext } from "../context/CurrentWorkoutSessionContext";
import { auth } from "../firebase";
import { getFirebaseErrorMessage } from "../utils/error";

function createData(set: number, reps: number) {
  return { set, reps };
}

const rows = [
  createData(1, 12),
  createData(2, 11),
  createData(3, 10),
  createData(4, 8),
];

interface IFormInput {
  workoutType: string;
  workout: string;
  set: number;
  reps: number;
}

export default function HomePage() {
  const { currentUser, dispatch } = useContext(AuthContext);
  const { currentWorkoutSession, setCurrentWorkoutSession } = useContext(
    CurrentWorkoutSessionContext
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const handleCreateWorkoutSession = async () => {
    try {
      if (currentUser) {
        const docSnap = await createWorkoutSession(currentUser.uid);
        setCurrentWorkoutSession(docSnap);
      }
    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <Box sx={{ padding: "1em" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            gap: "0.5em",
            alignItems: "center",
          }}
        >
          {currentUser && currentUser.photoURL ? (
            <Avatar src={currentUser.photoURL} />
          ) : (
            <Avatar />
          )}
          <Typography
            sx={{
              background: "linear-gradient(to right, #007FFF, #0059B2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            {currentUser?.displayName}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={handleLogout}
          >
            {" "}
            Log out
          </Button>
          {errorMessage && (
            <Typography color={red[500]} marginLeft={"1em"} fontSize={"medium"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>

      {currentWorkoutSession ? (
        <CurrentWorkoutSession />
      ) : (
        <Box marginTop={"1em"}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={handleCreateWorkoutSession}
          >
            Create a session
          </Button>
          <Typography marginTop={"0.5em"}>
            Start your workout session and add your sets
          </Typography>
        </Box>
      )}
      <PreviousWorkoutSessions />
    </Box>
  );
}
