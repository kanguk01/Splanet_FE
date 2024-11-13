import { css } from "@emotion/react";

export const appContainerStyles = css`
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 0.4rem;
`;

export const appTitleStyles = css`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

/* calendarStyles */
export const calendarStyles = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 6.4rem - 40px);
  min-height: 400px;
  max-height: 720px;
  font-size: 0.7rem;

  .fc-toolbar {
    flex-direction: column;
    align-items: center;
  }

  .fc-toolbar-chunk {
    margin-bottom: 0.5rem;
  }

  .fc-toolbar-title {
    font-size: 0.8rem !important;
  }

  .fc-event-main {
    padding: 0.16rem;
  }

  .fc-timegrid-slot {
    height: 1rem;
  }

  .fc-view-harness {
    height: calc(100vh - 120px) !important;
  }

  /* 모바일: 3개의 열 */
  .fc-timegrid-col {
    flex-basis: calc(100% / 3) !important; /* 3개의 열 */
  }

  .fc-timegrid-slot {
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }

  /* 데스크탑 스타일 적용 (1280px 이상) */
  @media (min-width: 1280px) {
    font-size: 0.8rem;

    .fc-toolbar-title {
      font-size: 1.2rem !important;
    }

    .fc-timegrid-slot {
      height: 2.4rem;
    }

    /* 데스크탑: 7개의 열 */
    .fc-timegrid-col {
      flex-basis: calc(100% / 7); /* 7개의 열 */
    }
  }

  .fc-event {
    cursor: move;
  }

  .fc-event-main {
    padding: 0.2rem;
    width: 100% !important;
  }

  .fc-event-completed {
    background-color: #e5e7eb;
    border-left: 3.2px solid #9ca3af;
  }

  .fc-event-upcoming {
    background-color: #dbeafe;
    border-left: 3.2px solid #3b82f6;
  }

  .fc-event-incomplete {
    background-color: #fee2e2;
    border-left: 3.2px solid #ef4444;
  }

  .fc-event-completed .fc-event-title,
  .fc-event-completed .fc-event-time {
    text-decoration: line-through;
  }

  /* 1시간 간격 */
  .fc-timegrid-slot-minor {
    border-bottom: 1px dashed rgba(229, 231, 235, 0.8);
  }

  .fc-timegrid-axis {
    width: 2.4rem;
  }

  .fc-timegrid-col {
    border-right: 1px solid #e5e7eb;
  }

  .fc-timegrid-col-frame {
    position: relative;
  }

  .fc-timegrid-event {
    border-radius: 0;
  }

  .fc-timegrid-event-harness {
    margin-right: 0.8px;
  }

  .fc-direction-ltr .fc-timegrid-col-events {
    margin: 0px !important;
  }

  .fc-day-today {
    background-color: inherit !important;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: #39a7f7 !important;
    color: white;
  }

  .fc-button {
    border: none;
    padding: 0.4rem 0.8rem;
    background-color: #39a7f7;
    color: white;
    transition: background-color 0.3s ease;
  }

  .fc-button:hover {
    background-color: #338bd0;
  }

  .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fc-toolbar-title {
    font-size: 1rem !important;
  }
`;

export const eventItemStyles = (status: string, isDragging: boolean) => css`
  position: absolute;
  left: 0;
  right: 0;
  padding: 0.2rem;
  font-size: 0.8rem;
  border-left-width: 3.2px;
  box-sizing: border-box;
  opacity: ${isDragging ? 0.5 : 1};

  ${status === "completed" &&
  `
    background-color: #e5e7eb;
    border-left-color: #9ca3af;
  `}
  ${status === "upcoming" &&
  `
    background-color: #dbeafe;
    border-left-color: #3b82f6;
  `}
  ${status === "incomplete" &&
  `
    background-color: #fee2e2;
    border-left-color: #ef4444;
  `}
`;

export const dropdownMenuStyles = css`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  list-style: none;
  padding: 8px 0;
  margin: 4px 0 0 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 100px;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const dropdownItemStyles = css`
  padding: 10px 12px;
  color: blue;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
  display: block;
  white-space: nowrap;

  &:hover {
    padding: 7px 11px; /* hover 시 패딩을 줄여 크기 감소 */
  }
`;

export const dropdownItemRedStyles = css`
  ${dropdownItemStyles}
  color: red;
  &:hover {
    padding: 7px 11px; /* hover 시 패딩을 줄여 크기 감소 */
  }
`;
