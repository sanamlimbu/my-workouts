import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import {
  deleteWorkoutFromSession,
  fetchCurrentWorkoutSessionQueryDocSnapshot,
} from "../api/firebase";
import { AuthContext } from "../context/AuthContext";
import { CurrentWorkoutSessionContext } from "../context/CurrentWorkoutSessionContext";
import { Workout } from "../types/types";
export default function WorkoutsTable(props: {
  name: string;
  workouts: Workout[];
  deletableRow?: boolean;
}) {
  const { name, workouts, deletableRow } = props;
  const { currentWorkoutSession, setCurrentWorkoutSession } = useContext(
    CurrentWorkoutSessionContext
  );
  const { currentUser } = useContext(AuthContext);

  const handleDelete = async (workoutId: string) => {
    try {
      if (currentWorkoutSession && currentUser) {
        await deleteWorkoutFromSession(currentWorkoutSession.id, workoutId);
        const _currentWorkoutSession =
          await fetchCurrentWorkoutSessionQueryDocSnapshot(currentUser.uid);
        setCurrentWorkoutSession(_currentWorkoutSession);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Box maxWidth="12em">
      <Typography
        fontWeight="bold"
        sx={{
          background: "linear-gradient(to right, #007FFF, #0059B2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}
      >
        {name}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                KG
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Reps
              </TableCell>
              {deletableRow && (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold" }}
                ></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow
                key={workout.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">{workout.weight}</TableCell>
                <TableCell align="center">{workout.reps}</TableCell>
                {deletableRow && (
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(workout.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
