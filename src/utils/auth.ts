import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

/**
 * Retrieves the user information from localStorage.
 * @returns The user object if found, otherwise null.
 */
export function getUserFromLocalStorage(): User | null {
  try {
    const userKey = Object.keys(window.localStorage).find((key) =>
      key.startsWith("firebase:authUser")
    );
    if (userKey) {
      const userString: string | null = localStorage.getItem(userKey);
      if (userString) {
        const currentUser: User = JSON.parse(userString);
        return currentUser;
      }
    }
  } catch (error) {
    console.error("Error retrieving user from localStorage:", error);
  }
  return null;
}

/**
 * Saves the user information in localStorage.
 * @param user The user object to be saved.
 * @returns void
 */
export function saveUserInLocalStorage(user: User) {
  try {
    const userString = JSON.stringify(user);
    localStorage.setItem("my_workouts_firebase_auth_user", userString);
  } catch (error) {
    console.error("Error saving user in localStorage:", error);
  }
}

/**
 * Removes the user from localStorage.
 * @returns void
 */
export function removeUserFromLocalStorage() {
  try {
    localStorage.removeItem("my_workouts_firebase_auth_user");
  } catch (error) {
    console.error("Error removing user from localStorage:", error);
  }
}

/**
 * Validates a password based on the following criteria:
 * - Minimum length of 8 characters
 * - At least one uppercase letter
 * - At least one numeric digit
 *
 * @param password The password to validate.
 * @returns An error message if the password fails the validation, otherwise an empty string.
 */
export function validatePassword(password: string): string {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const errorMessage =
    "Password must be at least 8 characters long, have at least one uppercase letter, and one numeric digit.";

  if (password.length < minLength || !hasUpperCase || !hasNumber) {
    return errorMessage;
  }

  return "";
}

/**
 * Checks if a given expiration time has passed or is in the future compared to the current timestamp.
 * @param expirationTime - The expiration time as a Firebase Firestore Timestamp object.
 * @returns `true` if the expiration time has passed, `false` if it is in the future.
 */
export function isTokenExpired(expirationTime: Timestamp) {
  const currentTimestamp = Timestamp.now();
  return expirationTime.toMillis() < currentTimestamp.toMillis();
}
