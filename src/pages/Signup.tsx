import {
  EmailOutlined,
  LockOutlined,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "../assets/facebook.svg";
import GoogleIcon from "../assets/google.svg";
import { AuthContext } from "../context/AuthContext";
import { auth, facebookProvider, googleProvider } from "../firebase";
import { validatePassword } from "../utils/auth";
import { getFirebaseErrorMessage } from "../utils/error";

interface ISignUpFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
  const [socialSignUpErrorMessage, setSocialSignUpErrorMessage] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const registerWithEmailAndPassword: SubmitHandler<ISignUpFormInput> = async (
    input
  ) => {
    if (input.password !== input.confirmPassword) {
      setSignUpErrorMessage("Passwords did not match.");
      return;
    }
    const errorMessage = validatePassword(input.password);
    if (errorMessage) {
      setSignUpErrorMessage(errorMessage);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      await updateProfile(user, { displayName: input.name });
      navigate("/verify-account");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setSignUpErrorMessage(errorMessage);
    }
  };

  const registerWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setSocialSignUpErrorMessage(errorMessage);
    }
  };

  const registerWithFacebook = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setSocialSignUpErrorMessage(errorMessage);
    }
  };

  const handleInputChange = () => {
    setSignUpErrorMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ margin: "1em", maxWidth: "24em" }}>
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(to right, #007FFF, #0059B2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Welcome
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            marginTop: "0.5em",
            marginBottom: "1em",
            color: "rgb(61,59,64)",
          }}
        >
          Create account and start tracking your workouts.
        </Typography>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            marginBottom: "1em",
          }}
          onSubmit={handleSubmit(registerWithEmailAndPassword)}
        >
          <div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Full name"
              {...register("name", {
                required: {
                  value: true,
                  message: "Please enter your full name.",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              onChange={handleInputChange}
            />
            {errors.name && (
              <Typography
                color={red[500]}
                fontSize={"small"}
                marginTop={"0.5em"}
              >
                {errors.name.message}
              </Typography>
            )}
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Email address"
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter a valid email address.",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
              onChange={handleInputChange}
            />
            {errors.email && (
              <Typography
                color={red[500]}
                marginTop={"0.5em"}
                fontSize={"small"}
              >
                {errors.email.message}
              </Typography>
            )}
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter a password.",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityOff
                        onClick={() => setShowPassword(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    ) : (
                      <Visibility
                        onClick={() => setShowPassword(true)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={handleInputChange}
            />
            {errors.password && (
              <Typography
                color={red[500]}
                marginTop={"0.5em"}
                fontSize={"small"}
              >
                {errors.password.message}
              </Typography>
            )}
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Please enter a password.",
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showConfirmPassword ? (
                      <VisibilityOff
                        onClick={() => setShowConfirmPassword(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    ) : (
                      <Visibility
                        onClick={() => setShowConfirmPassword(true)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <Typography
                color={red[500]}
                marginTop={"0.5em"}
                fontSize={"small"}
              >
                {errors.confirmPassword.message}
              </Typography>
            )}
          </div>
          <div>
            <Button
              variant="contained"
              sx={{ textTransform: "none", fontWeight: "bold" }}
              type="submit"
              fullWidth
            >
              Create account
            </Button>
            {signUpErrorMessage && (
              <Typography color={red[500]} marginTop={"1em"} fontSize={"small"}>
                {signUpErrorMessage}
              </Typography>
            )}
          </div>
        </form>
        <Typography marginBottom="0.5em" textAlign="center">
          Already have an account?{" "}
          <Button
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
            color="secondary"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>{" "}
        </Typography>

        <Divider sx={{ marginBottom: "1em" }}>
          <Typography sx={{ fontWeight: "bold", color: "rgb(61,59,64)" }}>
            OR{" "}
          </Typography>{" "}
        </Divider>
        <div>
          <Button
            variant="contained"
            color="info"
            fullWidth
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
              marginBottom: "1em",
              fontWeight: "bold",
            }}
            onClick={() => registerWithGoogle()}
          >
            <img
              src={GoogleIcon}
              alt="Google Icon"
              style={{
                height: "30px",
                marginRight: "1em",
              }}
            />{" "}
            Sign up with Google
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
              fontWeight: "bold",
            }}
            onClick={() => registerWithFacebook()}
          >
            <img
              src={FacebookIcon}
              alt="Facebook Icon"
              style={{
                height: "30px",
                marginRight: "1em",
              }}
            />{" "}
            Sign up with Facebook
          </Button>
          {socialSignUpErrorMessage && (
            <Typography color={red[500]} marginTop={"1em"} fontSize={"small"}>
              {socialSignUpErrorMessage}
            </Typography>
          )}
        </div>
      </div>
    </Box>
  );
}
