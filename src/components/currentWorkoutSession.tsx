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
import { v4 as uuidv4 } from "uuid";
import { deleteWorkoutSession, endWorkoutSession } from "../api/firebase";
import { CurrentWorkoutSessionContext } from "../context/CurrentWorkoutSessionContext";
import { db } from "../firebase";
import { WorkoutSession, WorkoutType } from "../types/types";
import { getFirebaseErrorMessage } from "../utils/error";
import {
  convertFirestoreTimestampToString,
  getWorkoutsByType,
  groupWorkoutsByName,
} from "../utils/helper";
import WorkoutsTable from "./workoutsTable";

interface IFormInput {
  type: WorkoutType;
  name: string;
  reps: number;
  weight: number;
}

export default function CurrentWorkoutSession() {
  const [workoutType, setWorkoutType] = useState(WorkoutType.Chest);
  const { currentWorkoutSession, setCurrentWorkoutSession } = useContext(
    CurrentWorkoutSessionContext
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [openEndSessionModal, setOpenEndSessionModal] = useState(false);
  const [openDeleteSessionModal, setOpenDeleteSessionModal] = useState(false);

  const createdAt = currentWorkoutSession?.data().createdAt;

  const { control, handleSubmit, register, reset } = useForm({
    defaultValues: {
      type: workoutType,
      reps: 12,
      weight: 20,
      name: getWorkoutsByType(workoutType)[0],
    },
  });

  useEffect(() => {
    reset({
      type: workoutType,
      name: getWorkoutsByType(workoutType)[0],
      reps: 12,
      weight: 20,
    });
  }, [workoutType]);

  const groupedWorkouts = currentWorkoutSession
    ? groupWorkoutsByName(currentWorkoutSession.data().workouts)
    : null;

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      if (currentWorkoutSession) {
        const workoutSessionRef = doc(
          db,
          "workoutSessions",
          currentWorkoutSession.id
        );
        const newWorkout = {
          id: uuidv4(),
          type: data.type,
          reps: data.reps,
          weight: data.weight,
          name: data.name,
        };

        await updateDoc(workoutSessionRef, {
          workouts: arrayUnion(newWorkout),
        });

        const updatedDocSnapshot = await getDoc(workoutSessionRef);
        if (updatedDocSnapshot.exists()) {
          setCurrentWorkoutSession(
            updatedDocSnapshot as QueryDocumentSnapshot<WorkoutSession>
          );
        }
      }
    } catch (error: any) {
      setErrorMessage(getFirebaseErrorMessage(error.code));
    }
  };

  const handleEndSessionModalClose = () => {
    setOpenEndSessionModal(false);
  };

  const handleDeleteSessionModalClose = () => {
    setOpenDeleteSessionModal(false);
  };

  const handleEndSession = async () => {
    try {
      if (currentWorkoutSession) {
        await endWorkoutSession(currentWorkoutSession?.id);
        setOpenEndSessionModal(false);
        setCurrentWorkoutSession(undefined);
      }
    } catch (error: any) {
      console.log(error.code);
    }
  };

  const handleDeleteSession = async () => {
    try {
      if (currentWorkoutSession) {
        await deleteWorkoutSession(currentWorkoutSession.id);
        setOpenDeleteSessionModal(false);
        setCurrentWorkoutSession(undefined);
      }
    } catch (error: any) {
      console.log(error.code);
    }
  };

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
        Current session
      </Typography>
      <Box
        sx={{
          padding: "1em",
          background: "rgb(225,228,230)",
          borderRadius: "12px",
        }}
      >
        <Typography sx={{ marginBottom: "1em", fontWeight: "bold" }}>
          {createdAt && convertFirestoreTimestampToString(createdAt)}
        </Typography>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", gap: "1em", flexWrap: "wrap" }}>
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
              <div style={{ maxWidth: "8em" }}>
                <Typography fontWeight={"bold"}>Reps</Typography>
                <TextField size="small" {...register("reps")} />
              </div>
              <div style={{ maxWidth: "8em" }}>
                <Typography fontWeight={"bold"}>KG</Typography>
                <TextField size="small" {...register("weight")} />
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
        <Box
          sx={{
            display: "flex",
            gap: "1em",
            flexWrap: "wrap",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          {groupedWorkouts &&
            Object.entries(groupedWorkouts).map(([key, value]) => (
              <WorkoutsTable key={key} name={key} workouts={value} />
            ))}
        </Box>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              marginRight: "1em",
            }}
            disabled={
              currentWorkoutSession?.data().workouts.length === 0 ? true : false
            }
            onClick={() => {
              setOpenEndSessionModal(true);
            }}
          >
            Save session
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={() => setOpenDeleteSessionModal(true)}
          >
            Delete session
          </Button>
        </Box>
      </Box>
      <EndSessionModal
        open={openEndSessionModal}
        onClose={handleEndSessionModalClose}
        handleEndSession={handleEndSession}
      />
      <DeleteSessionModal
        open={openDeleteSessionModal}
        onClose={handleDeleteSessionModalClose}
        handleDeleteSession={handleDeleteSession}
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
      <DialogTitle>End and save session confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to end and save session?
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

const DeleteSessionModal = (props: {
  open: boolean;
  onClose: () => void;
  handleDeleteSession: () => void;
}) => {
  const { open, onClose, handleDeleteSession } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete workout session confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete session?
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
          onClick={handleDeleteSession}
          sx={{ textTransform: "none" }}
        >
          Delete session
        </Button>
      </DialogActions>
    </Dialog>
  );
};
