import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import red from "@mui/material/colors/red";

import {
  QueryDocumentSnapshot,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { fetchCurrentWorkoutSessionQueryDocSnapshot } from "../api/firebase";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { WorkoutSession, WorkoutType } from "../types/types";
import { getFirebaseErrorMessage } from "../utils/error";
import { getWorkoutsByType, groupWorkoutsByName } from "../utils/helper";
import WorkoutsTable from "./workoutsTable";

interface IFormInput {
  type: WorkoutType;
  name: string;
  set: number;
  reps: number;
  weight: number;
}
function createData(set: number, reps: number) {
  return { set, reps };
}

const rows = [
  createData(1, 12),
  createData(2, 11),
  createData(3, 10),
  createData(4, 8),
];
export default function CurrentWorkoutSession() {
  const { currentUser } = useContext(AuthContext);
  const [workoutType, setWorkoutType] = useState(WorkoutType.Chest);
  const [
    currentWorkoutSessionQueryDocSnapshot,
    setCurrentWorkoutSessionQueryDocSnapshot,
  ] = useState<QueryDocumentSnapshot<WorkoutSession>>();
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { control, handleSubmit, register, reset } = useForm({
    defaultValues: {
      type: workoutType,
      set: 1,
      reps: 12,
      weight: 20,
      name: getWorkoutsByType(workoutType)[0],
    },
  });

  useEffect(() => {
    (async () => {
      try {
        if (currentUser) {
          const workoutSessionQueryDocSnapshot: QueryDocumentSnapshot<WorkoutSession> =
            await fetchCurrentWorkoutSessionQueryDocSnapshot(currentUser.uid);
          setCurrentWorkoutSessionQueryDocSnapshot(
            workoutSessionQueryDocSnapshot
          );
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    reset({
      type: workoutType,
      name: getWorkoutsByType(workoutType)[0],
      set: 1,
      reps: 12,
      weight: 20,
    });
  }, [workoutType]);

  const groupedWorkouts = currentWorkoutSessionQueryDocSnapshot
    ? groupWorkoutsByName(currentWorkoutSessionQueryDocSnapshot.data().workouts)
    : null;

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      if (currentWorkoutSessionQueryDocSnapshot) {
        const workoutSessionRef = doc(
          db,
          "workoutSessions",
          currentWorkoutSessionQueryDocSnapshot.id
        );
        const newWorkout = {
          type: data.type,
          set: data.set,
          reps: data.reps,
          weight: data.weight,
          name: data.name,
        };

        await updateDoc(workoutSessionRef, {
          workouts: arrayUnion(newWorkout),
        });

        const updatedDocSnapshot = await getDoc(workoutSessionRef);
        if (updatedDocSnapshot.exists()) {
          setCurrentWorkoutSessionQueryDocSnapshot(
            updatedDocSnapshot as QueryDocumentSnapshot<WorkoutSession>
          );
        }
      }
    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleEndSession = () => {
    try {
    } catch (error: any) {}
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginTop: "1em", fontWeight: "bold" }}>
        Current session
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
        <Box maxWidth={"30em"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", gap: "1em" }}>
              <div>
                <Typography fontWeight={"bold"}>Type</Typography>
                <FormControl fullWidth {...register("type")}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        onChange={(e) => {
                          setWorkoutType(e.target.value as WorkoutType);
                          field.onChange(e);
                        }}
                      >
                        {Object.values(WorkoutType).map((value) => (
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
                <FormControl fullWidth {...register("name")}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small">
                        {getWorkoutsByType(workoutType).map((value) => (
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
              <div>
                <Typography fontWeight={"bold"}>Weight</Typography>
                <TextField fullWidth size="small" {...register("weight")} />
              </div>
            </div>
            <div style={{ marginTop: "1em", display: "flex", gap: "1em" }}>
              <Button
                variant="contained"
                type="submit"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Add workout
              </Button>
              {errorMessage && (
                <Typography
                  color={red[500]}
                  textAlign="center"
                  paddingTop={"10px"}
                  paddingBottom={"10px"}
                >
                  {errorMessage}
                </Typography>
              )}
            </div>
          </form>
        </Box>
        {groupedWorkouts &&
          Object.entries(groupedWorkouts).map(([key, value]) => (
            <WorkoutsTable key={key} name={key} workouts={value} />
          ))}
        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={() => setOpenModal(true)}
          >
            End session
          </Button>
        </Box>
      </Box>
      <EndSessionModal
        open={openModal}
        onClose={handleModalClose}
        handleEndSession={handleEndSession}
      />
    </Box>
  );
}

const EndSessionModal = (props: {
  open: boolean;
  onClose: () => void;
  handleEndSession: () => void;
}) => {
  const { open, onClose, handleEndSession } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>End workout session confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to end session?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleEndSession}
          sx={{ textTransform: "none" }}
        >
          End session
        </Button>
      </DialogActions>
    </Dialog>
  );
};
