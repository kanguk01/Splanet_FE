import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCalendar, {
  CalendarEvent,
} from "@/components/features/CustomCalendar/CustomCalendar";
import NumberButton from "@/components/common/NumberButton/NumberButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useGetPlanCard, { PlanCard } from "@/api/hooks/useGetPlanCard";

const PreviewPlanSelectPageContainer = styled.div`
  display: grid;
  align-items: center;
  margin: 0 auto;
  margin-top: 20px;
`;
const CalendarSection = styled.div`
  margin-bottom: 40px;
  ${breakpoints.mobile} {
    margin-bottom: -50px;
  }
`;
const SidebarSection = styled.div`
  font-size: 30px;
  font-weight: bold;
  ${breakpoints.mobile} {
    font-size: 18px;
  }
`;

const StyledText = styled.p`
  text-align: center;
`;

const NumberButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 130px;
  margin-bottom: 30px;
  ${breakpoints.mobile} {
    gap: 30px;
  }
`;

// 쿠키에서 정확하게 deviceId를 가져오는 함수
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};
// PlanCard 데이터를 CalendarEvent 형식으로 매핑
const mapPlanCardToCalendarEvent = (planCards: PlanCard[]): CalendarEvent[] => {
  console.log("Mapping PlanCards:", planCards);
  return planCards.map((card) => ({
    id: card.cardId,
    title: card.title,
    description: card.description,
    startDate: new Date(card.startDate),
    endDate: new Date(card.endDate),
    accessibility: true, // 필요에 따라 실제 데이터로 설정
    complete: false, // 필요에 따라 실제 데이터로 설정
  }));
};

const PlanSelectPage = () => {
  // 쿠키에서 deviceId 가져오기
  const deviceId = getCookie("device_id");
  console.log("Fetched deviceId:", deviceId);
  const { data: plans } = useGetPlanCard(deviceId || "");

  // 선택된 버튼 번호를 저장할 상태
  const [clickedNumber, setClickedNumber] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleNumberButtonClick = (number: number) => {
    setClickedNumber(number);
  };

  const calendarEvents =
    plans && plans.length > 0 && plans[0].planCards
      ? mapPlanCardToCalendarEvent(plans[0].planCards)
      : [];

  console.log("Plans data:", plans);
  console.log(
    "Plans.planCards data:",
    plans && plans.length > 0 ? plans[0].planCards : undefined,
  );
  console.log("Mapped calendar events:", calendarEvents);

  return (
    <PreviewPlanSelectPageContainer>
      <SidebarSection>
        <StyledText>원하는 플랜을 선택하세요.</StyledText>
        <NumberButtonContainer>
          <NumberButton
            number={1}
            clicked={clickedNumber === 1}
            onClick={() => handleNumberButtonClick(1)}
          />
          <NumberButton
            number={2}
            clicked={clickedNumber === 2}
            onClick={() => handleNumberButtonClick(2)}
          />
          <NumberButton
            number={3}
            clicked={clickedNumber === 3}
            onClick={() => handleNumberButtonClick(3)}
          />
        </NumberButtonContainer>
      </SidebarSection>
      <CalendarSection>
        <CustomCalendar plans={calendarEvents} />
      </CalendarSection>

      <ButtonContainer>
        <Button
          size="responsive"
          onClick={() => navigate(RouterPath.PLAN_UPDATE)}
        >
          확인
        </Button>
        <Button
          size="responsive"
          theme="secondary"
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
      </ButtonContainer>
    </PreviewPlanSelectPageContainer>
  );
};

export default PlanSelectPage;
