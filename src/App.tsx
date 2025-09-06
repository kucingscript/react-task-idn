import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import {
  Login,
  Home,
  NotFound,
  Dashboard,
  ItemTypes,
  Rooms,
  Items,
  Transactions,
  CreateTransaction,
  CreateItem,
} from "./pages";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import PublicRoute from "./components/PublicRoute/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    element: <PublicRoute />,
    children: [{ path: "login", element: <Login /> }],
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
          { path: "items", element: <Items /> },
          { path: "items/create", element: <CreateItem /> },
          { path: "transactions", element: <Transactions /> },
          { path: "transactions/create", element: <CreateTransaction /> },
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
