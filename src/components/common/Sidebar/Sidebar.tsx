import React, { useState, useEffect, useCallback } from "react";
import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import breakpoints from "@/variants/breakpoints";
import {
  SidebarContainer,
  MobileHeader,
  HamburgerMenu,
  MenuItemsContainer,
  MenuItem,
  StyledLink,
  MenuItemIcon,
  MenuItemText,
  TimeDisplay,
  DateDisplay,
} from "./Sidebar.styles";
import logo from "@/assets/logo.svg";

// 고정된 메뉴 항목 타입 정의
interface MenuItemType {
  name: string;
  icon: JSX.Element;
  path: string;
}

const menuItems: MenuItemType[] = [
  { name: "메인", icon: <Home />, path: "/main" },
  { name: "개인 플랜", icon: <CalendarMonth />, path: "/plan" },
  { name: "팀 플랜", icon: <Diversity3 />, path: "/team-plan" },
  { name: "친구", icon: <People />, path: "/friend" },
  { name: "마이페이지", icon: <Person />, path: "/mypage" },
];

const TimeComponent = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const now = new Date();
    const delay =
      60000 -
      (now.getSeconds() * 1000 + now.getMilliseconds());

    const timeoutId = setTimeout(() => {
      setTime(new Date());

      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 60000);

      return () => clearInterval(intervalId);
    }, delay);

    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => clearTimeout(timeoutId);
  }, []);

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      <TimeDisplay>{getFormattedTime(time)}</TimeDisplay>
      <DateDisplay>
        {time.toLocaleDateString("ko-KR", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </DateDisplay>
    </>
  );
};

interface MenuItemProps {
  item: MenuItemType;
  selected: boolean;
  onClick: () => void;
}

const MemoizedMenuItem = React.memo(
  ({ item, selected, onClick }: MenuItemProps) => (
    <MenuItem selected={selected} onClick={onClick}>
      <MenuItemIcon>{item.icon}</MenuItemIcon>
      <MenuItemText>
        <StyledLink to={item.path} selected={selected}>
          {item.name}
        </StyledLink>
      </MenuItemText>
    </MenuItem>
  ),
);

const MemoizedTimeComponent = React.memo(() => <TimeComponent />);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("메인");

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname,
    );
    if (currentItem) {
      setSelectedMenu(currentItem.name);
    }
  }, [location.pathname]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= breakpoints.sm && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleMenuClick = useCallback(
    (menuName: string, path: string) => {
      setSelectedMenu(menuName);
      navigate(path); // 페이지 이동 처리
    },
    [navigate],
  );

  const handleLogoClick = () => {
    navigate("/main");
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <MobileHeader>
        <img
          src={logo}
          alt="Logo"
          width="170"
          height="59"
          style={{ paddingTop: "10px", cursor: "pointer" }}
          onClick={handleLogoClick}
        />
        <HamburgerMenu onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </HamburgerMenu>
      </MobileHeader>

      {!isOpen && (
        <img
          src={logo}
          alt="Logo"
          width="170"
          height="59"
          style={{ marginBottom: "15px", cursor: "pointer" }}
          onClick={handleLogoClick}
        />
      )}

      <MenuItemsContainer isOpen={isOpen}>
        {menuItems.map((item) => (
          <MemoizedMenuItem
            key={item.name}
            item={item}
            selected={selectedMenu === item.name}
            onClick={() => handleMenuClick(item.name, item.path)}
          />
        ))}
      </MenuItemsContainer>

      {!isOpen && <MemoizedTimeComponent />}
    </SidebarContainer>
  );
};

export default Sidebar;
