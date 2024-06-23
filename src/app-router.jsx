import { Suspense, lazy } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Buzzer from "./pages/playlist/buzzer";

// General
const Root = lazy(() => import("./layout/root"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Home = lazy(() => import("./pages/home"));

/** Video **/
const ListVideo = lazy(() => import("./pages/video/video"));
/** Images **/
const ListImage = lazy(() => import("./pages/image/image"));

// Playlist
const ReadPlayList = lazy(() => import("./pages/playlist/read-playlist"));
const ListPlayList = lazy(() => import("./pages/playlist/playlist"));

function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "video",
          element: <ListVideo />,
        },
        {
          path: "playList",
          element: <ListPlayList />,
        },
        {
          path: "image",
          element: <ListImage />,
        },
        {
          path: "read-playList",
          element: <ReadPlayList />,
        },
        {
          path: "buzzer",
          element: <Buzzer />,
        },
        {
          path: "*",
          element: <p>404</p>,
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={"...loading"}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default AppRouter;
