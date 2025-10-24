import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import RiderDashboardPage from "../pages/RiderDashboardPage";
import DriverDashboardPage from "../pages/DriverDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute allowedRoles={['Rider']} />,
        children: [
          {
            path: "/rider-dashboard",
            element: <RiderDashboardPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Driver']} />,
        children: [
          {
            path: "/driver-dashboard",
            element: <DriverDashboardPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
          {
            path: "/admin-dashboard",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
