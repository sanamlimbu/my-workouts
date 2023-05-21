import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VerifyAccount() {
  const navigate = useNavigate();
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
          variant="h3"
          sx={{
            background: "linear-gradient(to right, #007FFF, #0059B2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Hi there
        </Typography>
        <Typography sx={{ marginTop: "1em", marginBottom: "1em" }}>
          Please verify your email address by clicking on the verification link
          we sent to you.
        </Typography>
        <Typography marginBottom={"1em"}>
          Once verified, you can log in and access your account.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ textTransform: "none", fontWeight: "bold" }}
          onClick={() => navigate("/login")}
        >
          Go to login page
        </Button>
      </div>
    </Box>
  );
}
