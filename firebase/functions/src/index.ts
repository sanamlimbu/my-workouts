import * as express from "express";
import * as functions from "firebase-functions";
import { getAllWorkouts } from "./api/workouts";
import { authenticateUser } from "./middlewares/auth";

const app = express();

app.get("/workouts", authenticateUser, getAllWorkouts);

export const api = functions.https.onRequest(app);
