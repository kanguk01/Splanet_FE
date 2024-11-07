import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import useSaveTeamPlan from "@/api/hooks/useTeamPlanSave";
import useUpdateTeamPlan  from "@/api/hooks/useUpdateTeamPlan";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";
import useDeleteTeamPlan  from "@/api/hooks/useDeleteTeamPlan";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

export default function TeamPlanChangePage() {
  const location = useLocation();
  const { teamId, teamName, plans = [] } = location.state || {};
  const [modifiedPlans, setModifiedPlans] = useState<CalendarEvent[]>(plans);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlanData, setNewPlanData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    accessibility: true,
    isCompleted: false,
  });
  const navigate = useNavigate();

  const { mutate: savePlan } = useSaveTeamPlan();
  const { mutate: updatePlan } = useUpdateTeamPlan();
  const { mutate: deletePlan } = useDeleteTeamPlan();

  const handleAddPlan = () => setIsAddModalOpen(true); // 모달 열기

  const handleAddPlanSubmit = () => {
    const {
      title,
      description,
      startDate,
      endDate,
      accessibility,
      isCompleted,
    } = newPlanData;
    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    savePlan(
      {
        teamId,
        plan: {
          title,
          description,
          startDate: utcStartDate,
          endDate: utcEndDate,
          accessibility,
          isCompleted,
        },
      },
      {
        onSuccess: () => {
          alert("플랜이 추가되었습니다.");
          setModifiedPlans([
            ...modifiedPlans,
            {
              ...newPlanData,
              id: Date.now().toString(),
              start: new Date(startDate),
              end: new Date(endDate),
              complete: isCompleted,
            },
          ]);
          setIsAddModalOpen(false);
        },
        onError: (error) => {
          alert(`추가 중 오류 발생: ${error.message}`);
        },
      },
    );
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deletePlan(
        { teamId, planId: parseInt(planId, 10) },
        {
          onSuccess: () => {
            alert("플랜이 삭제되었습니다.");
            setModifiedPlans((prevPlans) =>
              prevPlans.filter((plan) => plan.id !== planId),
            );
          },
          onError: (error) => {
            alert(`삭제 중 오류 발생: ${error.message}`);
          },
        },
      );
    }
  };

  const handlePlanChange = (updatedPlans: CalendarEvent[]) => {
    setModifiedPlans(updatedPlans);
  };

  const handleSaveAll = () => {
    modifiedPlans.forEach((plan) => {
      if (plan.id && typeof plan.id === "string") {
        // 문자열로 확인
        updatePlan({
          teamId,
          planId: parseInt(plan.id, 10),
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
    });
    alert("수정사항이 저장되었습니다.");
    navigate(`/team-plan/${teamId}`, { state: { teamId, teamName } });
  };

  return (
    <PageContainer>
      <Button onClick={handleAddPlan}>플랜 추가</Button>
      <CustomCalendar
        calendarOwner={`${teamName} 수정`}
        plans={modifiedPlans}
        isReadOnly={false}
        onPlanChange={handlePlanChange}
        onDeletePlan={handleDeletePlan}
      />
      <Button onClick={handleSaveAll}>저장</Button>

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2>새로운 플랜 추가</h2>
          <input
            placeholder="제목"
            value={newPlanData.title}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, title: e.target.value })
            }
          />
          <input
            placeholder="설명"
            value={newPlanData.description}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, description: e.target.value })
            }
          />
          <input
            type="datetime-local"
            placeholder="시작 시간"
            value={newPlanData.startDate}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, startDate: e.target.value })
            }
          />
          <input
            type="datetime-local"
            placeholder="종료 시간"
            value={newPlanData.endDate}
            onChange={(e) =>
              setNewPlanData({ ...newPlanData, endDate: e.target.value })
            }
          />
          <Button onClick={handleAddPlanSubmit}>추가</Button>
        </Modal>
      )}
    </PageContainer>
  );
}
