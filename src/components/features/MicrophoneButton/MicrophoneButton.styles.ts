// src/components/features/MicrophoneButton/MicrophoneButton.styles.ts
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const ButtonContainer = styled(motion.button)`
  border: none;
  background: none;
  cursor: pointer;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  outline: none;

  width: 58px;
  height: 58px;

  &:focus {
    outline: none;
  }
`;

export const CircleBackground = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #2196f3;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  position: absolute;
`;

export const MicrophoneIcon = styled(motion.g)`
  fill: white;
`;

export const WaveContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Wave = styled(motion.div)`
  background-color: white;
  border-radius: 5px;
  width: 4px;
  height: 8px;
`;
