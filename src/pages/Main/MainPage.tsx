// mainPage.tsx
import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import { useGetPlans } from "@/api/hooks/useGetPlans";
import useCreatePlan from "@/api/hooks/useCreatePlan";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";

const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
`;

export default function MainlPage() {
  const { data: Plans, isLoading, error, refetch } = useGetPlans();

  const savePlanMutation = useCreatePlan();
  const isPlanSaved = useRef(false);
  const hasMounted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasMounted.current) return; // strict모드로 인한 두 번 실행을 막기위해
    hasMounted.current = true;

    const savePlans = async () => {
      const storedPlans = sessionStorage.getItem("plans");
      if (storedPlans && !isPlanSaved.current) {
        const parsedPlans: CalendarEvent[] = JSON.parse(storedPlans).map(
          (plan: CalendarEvent) => ({
            ...plan,
            start: new Date(plan.start),
            end: new Date(plan.end),
          }),
        );

        try {
          for (const plan of parsedPlans) {
            await savePlanMutation.mutateAsync({
              plan: {
                title: plan.title,
                description: plan.description,
                startDate: plan.start.toISOString(),
                endDate: plan.end.toISOString(),
                accessibility: plan.accessibility ?? true,
                isCompleted: plan.complete ?? false,
              },
            });
          }
          sessionStorage.removeItem("plans");
          console.log("세션의 플랜이 저장되었습니다.");
          isPlanSaved.current = true; // Set flag after saving
          refetch();
        } catch (error) {
          console.error("세션의 플랜 저장 실패:", error);
        }
      }
    };

    savePlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModifyClick = () => {
    navigate(RouterPath.MAIN_MODIFY, { state: { plans: Plans } });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 불러오지 못했습니다. 오류: {error.message}</p>;

  return (
    <PageContainer>
      <CustomCalendar plans={Plans} isReadOnly />
      <Button
        onClick={handleModifyClick}
        theme="primary"
        style={{ marginTop: "20px" }}
      >
        수정하기
      </Button>
    </PageContainer>
  );
}
