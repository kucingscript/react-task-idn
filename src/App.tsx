import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import ItemTypes from "./pages/ItemTypes/ItemTypes";
import Rooms from "./pages/Rooms/Rooms";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "item-types", element: <ItemTypes /> },
          { path: "rooms", element: <Rooms /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
