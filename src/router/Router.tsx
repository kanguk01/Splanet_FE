import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LandingPage from "@/pages/Landing/LandingPage";
import RouterPath from "./RouterPath";
import LoginModal from "@/pages/LoginModal/LoginModal";
import TeamPlan from "@/pages/TeamPlan/TeamPlan";
import PlanPage from "@/pages/Plan/PlanPage";
import PlanSelectPage from "@/pages/Plan/PlanSelectPage";
import PlanUpdate from "@/pages/Plan/PlanUpdate";
import FriendPage from "@/pages/Friend/FriendPage";
import MyPage from "@/pages/Mypage/Mypage";
import Layout from "@/components/features/Layout/Layout";
import MainPage from "@/pages/Main/MainPage";
import FriendDetailPage from "@/pages/Friend/FriendDetailPage";
import useAuth from "@/provider/useAuth";
import TeamPlanDetailPage from "@/pages/TeamPlan/TeamPlanDetail";
import PreviewPlanSelectPage from "@/pages/PreviewPlan/PreviewPlanSelectPage";
import PreviewPlanUpdate from "@/pages/PreviewPlan/PreviewPlanUpdate";
import PreviewPlanPage from "@/pages/PreviewPlan/PreviewPlanPage";

function Router() {
  const { authState } = useAuth();
  const router = createBrowserRouter([
    {
      path: RouterPath.HOME, // 랜딩 페이지는 사이드바 없는 레이아웃
      element: <LandingPage />,
    },
    {
      path: RouterPath.LOGIN,
      element: <LoginModal />,
    },
    {
      path: RouterPath.PREVIEW_PLAN_SELECT,
      element: <PreviewPlanSelectPage />,
    },
    {
      path: RouterPath.PREVIEW_PLAN_UPDATE,
      element: <PreviewPlanUpdate />,
    },
    {
      path: RouterPath.PREVIEW_PLAN,
      element: <PreviewPlanPage />,
    },
    {
      path: "/",
      element: authState.isAuthenticated ? (
        <Layout />
      ) : (
        <Navigate to={RouterPath.LOGIN} />
      ),

      children: [
        { path: RouterPath.MAIN, element: <MainPage /> },
        { path: RouterPath.TEAM_PLAN, element: <TeamPlan /> },
        {
          path: `${RouterPath.TEAM_PLAN}/:teamId`,
          element: <TeamPlanDetailPage />,
        },
        { path: RouterPath.MY_PAGE, element: <MyPage /> },
        { path: RouterPath.PLAN, element: <PlanPage /> },
        {
          path: RouterPath.FRIEND,
          element: <FriendPage />,
        },
        {
          path: `${RouterPath.FRIEND}/:friendId`,
          element: <FriendDetailPage />,
        },
        { path: RouterPath.MY_PAGE, element: <MyPage /> },
        { path: RouterPath.PLAN_SELECT, element: <PlanSelectPage /> },
        { path: RouterPath.PLAN_UPDATE, element: <PlanUpdate /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;