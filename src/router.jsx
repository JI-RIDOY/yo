import { createBrowserRouter } from "react-router";
import Main from "./layouts/Main";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children:[
        {
            index: true,
            Component: Home,
        }
    ]
  },
]);