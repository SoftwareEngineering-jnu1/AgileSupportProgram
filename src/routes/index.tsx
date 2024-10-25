import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@components/features/Layout";

import { RouterPath } from "./path";

import MemoPage from "@pages/MemoPage";
import BoardPage from "@pages/BoardPage";
import TimelinePage from "@pages/TimelinePage";
import LoginPage from "@pages/LoginPage";
import Home from "@pages/Home";
import SignUpPage from "@pages/SignUpPage";
import MyPage from "@pages/MyPage";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "signup", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/mypage", element: <MyPage /> },
  {
    element: <Layout />,
    children: [
      {
        path: RouterPath.memoPage,
        element: <MemoPage />,
      },
      {
        path: RouterPath.boardPage,
        element: <BoardPage />,
      },
      {
        path: RouterPath.timelinePage,
        element: <TimelinePage />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
