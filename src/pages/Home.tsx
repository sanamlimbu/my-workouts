import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import red from "@mui/material/colors/red";
import { useContext, useState } from "react";

import { signOut } from "firebase/auth";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { WorkoutTypes } from "../constant";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

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
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, register, reset } = useForm({
    defaultValues: {
      workoutType: "Chest",
      workout: "Bench Press",
      set: 1,
      reps: 1,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    try {
    } catch (err) {}
  };

  const handleWorkoutTypeChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {}
  };

  return (
    <Box sx={{ padding: "1em" }}>
      <Typography
        variant="h3"
        sx={{
          background: "linear-gradient(to right, #007FFF, #0059B2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}
      >
        Sanam's workouts
      </Typography>
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

      <Box sx={{ marginTop: "1em" }}>
        <Typography
          variant="h6"
          sx={{
            background: "linear-gradient(to right, #007FFF, #0059B2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Add workout
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", gap: "1em" }}>
            <div>
              <Typography fontWeight={"bold"}>Type</Typography>
              <FormControl fullWidth {...register("workoutType")}>
                <Controller
                  name="workoutType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      onChange={handleWorkoutTypeChange}
                    >
                      {WorkoutTypes.map((value) => (
                        <MenuItem key={"workout-type" + value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div>
              <Typography fontWeight={"bold"}>Workout</Typography>
              <FormControl fullWidth {...register("workout")}>
                <Controller
                  name="workout"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} size="small">
                      {WorkoutTypes.map((value) => (
                        <MenuItem key={"workout" + value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div>
              <Typography fontWeight={"bold"}>Set</Typography>
              <TextField fullWidth size="small" {...register("set")} />
            </div>
            <div>
              <Typography fontWeight={"bold"}>Reps</Typography>
              <TextField fullWidth size="small" {...register("reps")} />
            </div>
          </div>
          <div style={{ marginTop: "1em", display: "flex", gap: "1em" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Add
            </Button>
            <Typography
              color={red[500]}
              textAlign="center"
              paddingTop={"10px"}
              paddingBottom={"10px"}
            >
              Something went wrong.
            </Typography>
          </div>
        </form>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ marginTop: "1em", fontWeight: "bold" }}>
          Today's session
        </Typography>
        <Box
          sx={{
            padding: "1em",
            background: "rgb(225,228,230)",
            display: "flex",
            gap: "1em",
            flexWrap: "wrap",
            borderRadius: "12px",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Chest
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: "linear-gradient(to right, #007FFF, #0059B2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Bench press Bench press
            </Typography>
            <TableContainer component={Paper} sx={{ minWidth: "12em" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Set</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Reps
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.set}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.set}
                      </TableCell>
                      <TableCell align="right">{row.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Chest
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: "linear-gradient(to right, #007FFF, #0059B2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Bench press
            </Typography>
            <TableContainer component={Paper} sx={{ minWidth: "12em" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Set</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Reps
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.set}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.set}
                      </TableCell>
                      <TableCell align="right">{row.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Chest
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: "linear-gradient(to right, #007FFF, #0059B2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Bench press
            </Typography>
            <TableContainer component={Paper} sx={{ minWidth: "12em" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Set</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Reps
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.set}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.set}
                      </TableCell>
                      <TableCell align="right">{row.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Chest
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: "linear-gradient(to right, #007FFF, #0059B2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Bench press
            </Typography>
            <TableContainer component={Paper} sx={{ minWidth: "12em" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Set</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Reps
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.set}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.set}
                      </TableCell>
                      <TableCell align="right">{row.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
