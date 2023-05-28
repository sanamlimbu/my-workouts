import { FirebaseErrorCode } from "../types/firebase";

export function getFirebaseErrorMessage(code: FirebaseErrorCode) {
  switch (code) {
    case FirebaseErrorCode.EmailAlreadyInUse: {
      return "Email already exists.";
    }
    case FirebaseErrorCode.InvalidEmail: {
      return "Invalid email address.";
    }
    case FirebaseErrorCode.UserNotFound: {
      return "User not found.";
    }
    case FirebaseErrorCode.WrongPassword: {
      return "Wrong password.";
    }
    case FirebaseErrorCode.TooManyRequests: {
      return "Too many requests, please try later.";
    }
    case FirebaseErrorCode.PermissionDenied: {
      return "Permission denied.";
    }
    default:
      return "Something went wrong.";
  }
}
