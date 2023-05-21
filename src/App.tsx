import { useContext } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/Signup";
import VerifyAccount from "./pages/VerifyAccount";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = (props: { children: JSX.Element }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
      return props.children;
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      ),
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "sign-up",
      element: <SignUpPage />,
    },
    {
      path: "verify-account",
      element: <VerifyAccount />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
