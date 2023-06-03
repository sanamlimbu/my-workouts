import { Box, Typography } from "@mui/material";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { WorkoutSession } from "../types/types";
import {
  calculateWorkoutDuration,
  convertFirestoreTimestampToString,
  getWorkoutTypes,
  groupWorkoutsByName,
} from "../utils/helper";
import WorkoutsTable from "./workoutsTable";

export default function WorkoutSessionSection(props: {
  doc: QueryDocumentSnapshot<WorkoutSession>;
}) {
  const { doc } = props;
  const { completedAt, createdAt, workouts } = doc.data();
  const groupedWorkouts = groupWorkoutsByName(workouts);
  const workoutTypes = getWorkoutTypes(workouts);

  return (
    <Box
      sx={{
        padding: "1em",
        background: "rgb(225,228,230)",
        borderRadius: "12px",
        marginBottom: "1em",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        {createdAt && convertFirestoreTimestampToString(createdAt)}
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        {createdAt &&
          completedAt &&
          calculateWorkoutDuration(createdAt, completedAt)}
      </Typography>
      <Typography>{Array.from(workoutTypes).join(", ")}</Typography>
      <Box sx={{ display: "flex", gap: "1em", flexWrap: "wrap" }}>
        {groupedWorkouts &&
          Object.entries(groupedWorkouts).map(([key, value]) => (
            <WorkoutsTable key={key} name={key} workouts={value} />
          ))}
      </Box>
    </Box>
  );
}
