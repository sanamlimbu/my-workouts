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
              <TableCell sx={{ fontWeight: "bold" }}>KG</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Reps
              </TableCell>
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
                <TableCell>{workout.weight}</TableCell>
                <TableCell align="right">{workout.reps}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
