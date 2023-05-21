import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth, facebookProvider, googleProvider } from "../firebase";
import { getFirebaseErrorMessage } from "../utils/error";

interface ILoginFormInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [socialLoginErrorMessage, setSocialLoginErrorMessage] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginWithEmailAndPassword: SubmitHandler<ILoginFormInput> = async (
    input
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setLoginErrorMessage(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setSocialLoginErrorMessage(errorMessage);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      setSocialLoginErrorMessage(errorMessage);
    }
  };

  const handleInputChange = () => {
    setLoginErrorMessage("");
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
      <div style={{ margin: "1em" }}>
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(to right, #007FFF, #0059B2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Hello again
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            marginTop: "0.5em",
            marginBottom: "1em",
            color: "rgb(61,59,64)",
          }}
        >
          Start tracking your workouts.
        </Typography>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            marginBottom: "1em",
          }}
          onSubmit={handleSubmit(loginWithEmailAndPassword)}
        >
          <div>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
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
            <Button
              variant="contained"
              sx={{ textTransform: "none", fontWeight: "bold" }}
              type="submit"
              fullWidth
            >
              Login
            </Button>
            {loginErrorMessage && (
              <Typography color={red[500]} marginTop={"1em"} fontSize={"small"}>
                {loginErrorMessage}
              </Typography>
            )}
          </div>
        </form>

        <Divider sx={{ marginBottom: "1em" }}>
          <Typography fontWeight={"bold"} color={"rgb(61,59,64)"}>
            OR{" "}
          </Typography>{" "}
        </Divider>
        <div>
          <Button
            variant="contained"
            fullWidth
            color="info"
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
              marginBottom: "1em",
              fontWeight: "bold",
            }}
            onClick={() => {
              loginWithGoogle();
            }}
          >
            <GoogleIcon sx={{ marginRight: "1em" }} /> Sign in with Google
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
              fontWeight: "bold",
            }}
            onClick={() => {
              loginWithFacebook();
            }}
          >
            <FacebookIcon sx={{ marginRight: "1em" }} /> Sign in with Facebook
          </Button>
          {socialLoginErrorMessage == "" && (
            <Typography color={red[500]} marginTop={"1em"} fontSize={"small"}>
              {socialLoginErrorMessage}
            </Typography>
          )}
        </div>
        <div style={{ marginTop: "1em" }}>
          <Typography textAlign={"center"}>
            Not signed up?{" "}
            <Button
              sx={{ textTransform: "none", fontWeight: "bold" }}
              color="secondary"
              onClick={() => navigate("/sign-up")}
            >
              Create an account
            </Button>
          </Typography>
        </div>
      </div>
    </Box>
  );
}
