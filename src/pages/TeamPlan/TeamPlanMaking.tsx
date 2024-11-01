import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/common/Input/Input";
import MicrophoneButton from "@/components/features/MicrophoneButton/MicrophoneButton";
import Button from "@/components/common/Button/Button";
import RouterPath from "@/router/RouterPath";
import {
  ParticipantsContainer,
  Participant,
  ParticipantName,
} from "./TeamPlanDetail";

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PlanPageContainer = styled.div`
  width: 60%;
  display: grid;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #938e8e;
  text-align: center;
  margin: 50px 0 0 0;
  @media (min-width: 1280px) {
    font-size: 30px;
  }
`;

const SubTitle = styled.p<{ animate: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin: 0;
  @media (min-width: 1280px) {
    font-size: 30px;
  }

  &.animate {
    animation: ${({ animate }) => (animate ? slideDown : "none")} 1s ease-in-out;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 130px;
  margin-bottom: 40px;
`;

// 고정된 부분들에 대해 memoization 적용
const MemoizedTitle = memo(() => {
  return <Title>마이크 버튼을 누르고 자세히 얘기해주세요.</Title>;
});

const MemoizedInput = memo(Input);
const MemoizedMicrophoneButton = memo(MicrophoneButton);
const MemoizedButton = memo(Button);
const MemoizedButtonContainer = memo(({ navigate }: { navigate: any }) => {
  return (
    <ButtonContainer>
      <MemoizedButton onClick={() => navigate(RouterPath.TEAM_PLAN_UPDATE)}>
        다음
      </MemoizedButton>
      <MemoizedButton onClick={() => navigate(-1)} theme="secondary">
        취소
      </MemoizedButton>
    </ButtonContainer>
  );
});

const TeamPlanMakingPage: React.FC = () => {
  const subTitleMessages = [
    "일정의 예상 소요 시간을 말해주시면 더 정확해요.",
    "고정된 일정이 있나요?",
    "쉬고 싶은 날은 꼭 말해주세요.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // 타이머 실행
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === subTitleMessages.length - 1 ? 0 : prevIndex + 1,
      );

      // 애니메이션 시작
      setAnimate(true);

      // 애니메이션이 끝난 후 애니메이션 초기화
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [subTitleMessages.length]);

  // useNavigate 선언
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // const [isRecording, setIsRecording] = useState(false); // 사용되지 않으므로 주석 처리

  // Float32Array를 Int16Array로 변환하는 함수
  function convertFloat32ToInt16(buffer: Float32Array) {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i += 1) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return result.buffer;
  }

  // 오디오 데이터를 16kHz로 다운샘플링하는 함수
  function downsampleBuffer(
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number,
  ) {
    if (outputSampleRate === inputSampleRate) {
      return convertFloat32ToInt16(buffer);
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i += 1
      ) {
        accum += buffer[i];
        count += 1;
      }
      result[offsetResult] = accum / count;
      offsetResult += 1;
      offsetBuffer = nextOffsetBuffer;
    }
    return convertFloat32ToInt16(result);
  }

  // 사용하지 않는 함수 주석 처리
  /*
  const handleStartRecording = async () => {
    console.log("녹음 시작");
    setIsRecording(true);
    ...
  };

  const handleStopRecording = () => {
    console.log("녹음 중지");
    setIsRecording(false);
    ...
  };
  */

  return (
    <PlanPageContainer>
      <InputWrapper>
        <MemoizedTitle />
        <SubTitle animate={animate}>
          {subTitleMessages[currentMessageIndex]}
        </SubTitle>
        <MemoizedInput
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <Button size="long">팀원 초대하기</Button>
        <ParticipantsContainer>
          <Participant>
            <ParticipantName>어피치</ParticipantName>
          </Participant>
          <Participant>
            <ParticipantName>프로도</ParticipantName>
          </Participant>
          <Participant>
            <ParticipantName>라이언</ParticipantName>
          </Participant>
          <Participant>
            <ParticipantName>춘식이</ParticipantName>
          </Participant>
          <Participant>
            <ParticipantName>네오</ParticipantName>
          </Participant>
        </ParticipantsContainer>
        {/* <MemoizedMicrophoneButton
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          isRecording={isRecording}
        /> */}
        <MemoizedButtonContainer navigate={navigate} />
      </InputWrapper>
    </PlanPageContainer>
  );
};

export default TeamPlanMakingPage;
