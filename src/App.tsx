import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "login", element: <Login /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
