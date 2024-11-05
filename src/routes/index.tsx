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
import ProjectListPage from "@pages/ProjectListPage";

const router = createBrowserRouter([
  { path: RouterPath.root, element: <Home /> },
  { path: RouterPath.projectList, element: <ProjectListPage /> },
  { path: RouterPath.signup, element: <SignUpPage /> },
  { path: RouterPath.login, element: <LoginPage /> },
  { path: RouterPath.myPage, element: <MyPage /> },
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
