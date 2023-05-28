import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Workout } from "../types/types";

export default function WorkoutsTable(props: {
  name: string;
  workouts: Workout[];
}) {
  const { name, workouts } = props;
  return (
    <Box>
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
      <TableContainer component={Paper} sx={{ minWidth: "12em" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Set</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reps</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Weight
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow
                key={workout.set}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {workout.set}
                </TableCell>
                <TableCell>{workout.reps}</TableCell>
                <TableCell align="right">{workout.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
