import { Request, Response } from "express";
import * as admin from "firebase-admin";
export async function getAllWorkouts(req: Request, res: Response) {
  const userUid = req.user.uid;
  try {
    const workoutsSnapshot = await admin
      .firestore()
      .collection(`users/${userUid}/workouts`)
      .get();
    const workoutsData = workoutsSnapshot.docs.map((doc) => doc.data());
    return res.status(200).json(workoutsData);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching workouts" });
  }
}
