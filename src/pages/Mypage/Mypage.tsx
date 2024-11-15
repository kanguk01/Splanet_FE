import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import List from "@/components/common/List/List";
import Button from "@/components/common/Button/Button";
import useUserData from "@/api/hooks/useUserData";
import useAuth from "@/hooks/useAuth";
import RouterPath from "@/router/RouterPath";
import breakpoints from "@/variants/breakpoints";
import useNotificationSetup from "@/api/hooks/useFcmUpdate"; // useNotificationSetup 훅을 사용
import { requestForToken } from "@/api/firebaseConfig";

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;

  ${breakpoints.mobile} {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding: 32px;
  overflow: auto;

  ${breakpoints.mobile} {
    padding: 16px;
  }
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;

  ${breakpoints.mobile} {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s;
  margin-bottom: 18px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  ${breakpoints.mobile} {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const ProfileCard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s;
  margin-bottom: 18px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  ${breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  ${breakpoints.mobile} {
    margin-bottom: 8px;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-left: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #4a5568;

  ${breakpoints.mobile} {
    font-size: 16px;
  }
`;

const CardContent = styled.div`
  font-size: 14px;
  color: #4a5568;

  ${breakpoints.mobile} {
    font-size: 13px;
  }
`;

const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 10px;

  ${breakpoints.mobile} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const FCM_TOKEN_KEY = "fcm_token";

export default function MyPage() {
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const { userData, handleDeleteAccount, handleSubscription } = useUserData();
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const fcmUpdateMutation = useNotificationSetup();

  // 초기 알림 상태 설정
  useEffect(() => {
    const savedToken = localStorage.getItem(FCM_TOKEN_KEY);
    setNotificationEnabled(!!savedToken);
  }, []);

  const handleNotificationToggle = async () => {
    try {
      const newState = !isNotificationEnabled;
      console.log("현재 알림 상태:", isNotificationEnabled);
      console.log("토글 후 상태가 될 값:", newState);

      if (newState) {
        // 알림 활성화
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert(
            "알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.",
          );
          return;
        }

        // FCM 토큰 새로 발급
        const newToken = await requestForToken();
        if (!newToken) {
          throw new Error("알림 토큰 발급 실패");
        }

        console.log("새로운 FCM 토큰:", newToken);

        // 토큰으로 알림 활성화 요청
        await fcmUpdateMutation.mutateAsync({
          token: newToken,
          isNotificationEnabled: true,
        });

        // 성공 시 토큰 저장 및 상태 업데이트
        localStorage.setItem(FCM_TOKEN_KEY, newToken);
        setNotificationEnabled(true);
        console.log("알림이 활성화되었습니다.");
      } else {
        // 알림 비활성화
        const currentToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (currentToken) {
          await fcmUpdateMutation.mutateAsync({
            token: currentToken,
            isNotificationEnabled: false,
          });
          localStorage.removeItem(FCM_TOKEN_KEY);
          setNotificationEnabled(false);
          console.log("알림이 비활성화되었습니다.");
        }
      }
    } catch (error: any) {
      console.error("알림 설정 변경 중 오류 발생:", error);
      console.error("서버 응답:", error.response?.data);
      console.error("상태 코드:", error.response?.status);
      alert(
        `알림 설정 변경에 실패했습니다. ${error.response?.data?.message || error.message}`,
      );
      setNotificationEnabled(!isNotificationEnabled);
    }
  };

  const handleSubscriptionClick = () => {
    if (userData.isPremium) {
      alert("이미 구독중입니다.");
    } else {
      handleSubscription();
    }
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false });
    localStorage.removeItem("authState");
    navigate(RouterPath.HOME);
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Heading>마이페이지</Heading>

        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <List
            name={userData.nickname}
            date={userData.isPremium ? "프리미엄 회원" : "일반 회원"}
          />
        </ProfileCard>

        <GridLayout>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardHeader>
              <CreditCardIcon fontSize="small" style={{ color: "#4a5568" }} />
              <CardTitle>구독정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="small" onClick={handleSubscriptionClick}>
                결제 요청
              </Button>
            </CardContent>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              opacity: isNotificationEnabled ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}
          >
            <CardHeader>
              <NotificationsIcon
                fontSize="small"
                style={{
                  color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                }}
              />
              <CardTitle
                style={{
                  color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                }}
              >
                알림설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: isNotificationEnabled ? "#4a5568" : "#9ca3af",
                  }}
                >
                  알림 {isNotificationEnabled ? "켜짐" : "꺼짐"}
                </span>
                <Switch
                  checked={isNotificationEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                  disabled={fcmUpdateMutation.isPending}
                />
              </div>
              {fcmUpdateMutation.isError && (
                <div
                  style={{ color: "red", fontSize: "12px", marginTop: "8px" }}
                >
                  알림 설정 변경에 실패했습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </GridLayout>

        <DeleteButtonWrapper>
          <Button onClick={handleLogout} size="small" theme="primary">
            로그아웃
          </Button>
          <Button onClick={handleDeleteAccount} size="small" theme="secondary">
            회원 탈퇴
          </Button>
        </DeleteButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}
