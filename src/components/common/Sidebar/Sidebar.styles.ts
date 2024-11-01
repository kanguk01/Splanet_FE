import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import breakpoints from "@/variants/breakpoints";

export const StyledLink = styled(Link)<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  text-decoration: none;
  display: block; /* 블록 요소로 변경하여 전체 영역을 클릭 가능하게 만듦 */
  width: 100%;
  height: 100%;
`;

// 사이드바 컨테이너
export const SidebarContainer = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => ({
    width: "200px",
    height: "100vh",
    justifyContent: "space-between",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
    zIndex: 1000,

    transition: "height 0.3s ease, width 0.3s ease",

    // 모바일 스타일
    [breakpoints.mobile]: {
      width: "100%",
      height: isOpen ? "auto" : "60px",
      justifyContent: "flex-start",
      padding: 0,
    },
  }),
);

// 메뉴 아이템 컨테이너
export const MenuItemsContainer = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "flex-start",
    width: "100%",
    boxSizing: "border-box",
    alignItems: "center",

    // 모바일 스타일
    [breakpoints.mobile]: {
      paddingTop: "70px", // 헤더 아래에서 시작하도록 여백 추가
      maxHeight: isOpen ? "500px" : "0",
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transition: "max-height 0.3s ease, opacity 0.3s ease",
    },
  }),
);

// 메뉴 아이템 스타일
export const MenuItem = styled.div<{ selected: boolean }>(({ selected }) => ({
  width: "100%",
  padding: "10px 17px",
  display: "flex",
  alignItems: "center",
  borderRadius: "15px",
  backgroundColor: selected ? "#39A7F7" : "transparent",
  color: selected ? "#FFFFFF" : "#000000",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "22.52px",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  marginBottom: "10px",
  "&:hover": {
    backgroundColor: selected ? "#39A7F7" : "#E0E0E0",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },

  ".icon": {
    marginRight: "8px",
    color: selected ? "#FFFFFF" : "#000000",
  },
}));

// 시간 및 날짜 표시
export const TimeDisplay = styled.div({
  fontSize: "40px",
  fontWeight: 700,
  textAlign: "center",
  marginTop: "auto",
  width: "100%",
  fontFamily: "monospace",
});

export const DateDisplay = styled.div({
  fontSize: "18px",
  fontWeight: 700,
  textAlign: "center",
  width: "100%",
});

// 모바일 헤더
export const MobileHeader = styled.div({
  display: "none",
  // 모바일 스타일
  [breakpoints.mobile]: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    height: "70px",
    backgroundColor: "#f5f5f5",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
  },
});

// 햄버거 메뉴
export const HamburgerMenu = styled.div({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
});

export const MenuItemIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

export const MenuItemText = styled.span`
  display: flex;
  align-items: center;
`;
