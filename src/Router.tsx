import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import HeaderLayout from './components/common/header/HeaderLayout';
import FAQPage from './pages/tips/FAQPage';
import RestaurantPage from './pages/tips/RestaurantPage';
import HospitalPage from './pages/tips/HospitalPage';
import ClubsPage from './pages/tips/ClubsPage';
import CulturePage from './pages/tips/culture/CulturePage';
import SogangMapPage from './pages/tips/SogangMapPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgetPassPage from './pages/ForgetPassPage';
import CultureDetailPage from './pages/tips/culture/CultureDetailPage';
import CommunityPage from './pages/community/CommunityPage';
import WriteCommunityPage from './pages/community/WriteCommunityPage';
import DetailCommunityPage from './pages/community/DetailCommunityPage';
import Google from './pages/Google';
import MarketPage from './pages/market/MarketPage';
import WriteMarketPage from './pages/market/WriteMarketPage';
import DetailMarketPage from './pages/market/DetailMarketPage';
import NotificatoinPage from './pages/NotificatoinPage';
import OnboardingPage from './pages/about/OnboardingPage';
import NoticePage from './pages/about/NoticePage';
import AdminVerifyPage from './pages/admin/AdminVerifyPage';
import NoticeWritePage from './pages/admin/NoticeWritePage';

import EditProfilePage from './pages/mypage/EditProfilePage';
import MyPageLayout from './components/mypage/MyPageLayout';
import VerificationPage from './pages/mypage/VerificationPage';
import MyPostsPage from './pages/mypage/MyPostsPage';
import MyCommentsPage from './pages/mypage/MyCommentsPage';
import MyScrapsPage from './pages/mypage/MyScrapsPage';
import NoticeDetailPage from './pages/about/NoticeDetailPage';

import ScrollToTop from './components/common/ScrollToTop';
import CultureCreatePage from './pages/admin/CultureCreatePage';
import { Suspense } from 'react';
import LoadingStateComponent from './components/common/LoadingStateComponent';

const Router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <HeaderLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <MainPage />
      },
      {
        path: 'tips',
        children: [
          {
            path: 'restaurant',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <RestaurantPage />
              </Suspense>
            )
          },
          {
            path: 'hospital',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <HospitalPage />
              </Suspense>
            )
          },
          {
            path: 'faq',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <FAQPage />
              </Suspense>
            )
          },
          {
            path: 'clubs',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <ClubsPage />
              </Suspense>
            )
          },
          {
            path: 'culture',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <CulturePage />
              </Suspense>
            )
          },
          {
            path: 'culture/:cultureId',
            element: (
              <Suspense fallback={<LoadingStateComponent />}>
                <CultureDetailPage />
              </Suspense>
            )
          }
        ]
      },
      {
        path: 'community',
        children: [
          { path: '', element: <CommunityPage /> },
          { path: 'write', element: <WriteCommunityPage /> },
          { path: 'detail/:id', element: <DetailCommunityPage /> },
          { path: 'detail/:id/edit', element: <WriteCommunityPage /> }
        ]
      },
      {
        path: 'market',
        children: [
          { path: '', element: <MarketPage /> },
          { path: 'write', element: <WriteMarketPage /> },
          { path: 'detail/:id', element: <DetailMarketPage /> },
          { path: 'detail/:id/edit', element: <WriteMarketPage /> }
        ]
      },
      {
        path: 'notification',
        element: <NotificatoinPage />
      },
      {
        path: 'about',
        children: [
          { path: 'onboarding', element: <OnboardingPage /> },
          { path: 'notice', element: <NoticePage /> },
          { path: 'notice/:id', element: <NoticeDetailPage /> }
        ]
      },
      {
        path: 'mypage',
        element: <MyPageLayout />,
        children: [
          { path: 'profile', element: <EditProfilePage /> },
          { path: 'verification', element: <VerificationPage /> },
          { path: 'posts', element: <MyPostsPage /> },
          { path: 'comments', element: <MyCommentsPage /> },
          { path: 'scraps', element: <MyScrapsPage /> }
        ]
      },
      {
        path: 'mypage',
        element: <MyPageLayout />,
        children: [
          { path: 'profile', element: <EditProfilePage /> },
          { path: 'verification', element: <VerificationPage /> },
          { path: 'posts', element: <MyPostsPage /> },
          { path: 'comments', element: <MyCommentsPage /> },
          { path: 'scraps', element: <MyScrapsPage /> }
        ]
      }
    ]
  },
  {
    path: 'tips/sogang-map',
    element: (
      <ProtectedRoute>
        <SogangMapPage />
      </ProtectedRoute>
    )
  },
  {
    path: 'sign-up',
    children: [{ path: '', element: <SignUpPage /> }]
  },
  {
    path: 'login',
    children: [
      { path: '', element: <LoginPage /> },
      { path: 'forgetpass', element: <ForgetPassPage /> },
      { path: 'google/callback', element: <Google /> }
    ]
  },
  {
    path: 'user/login/google/callback',
    element: <Google />
  },
  {
    path: 'admin',
    children: [
      { path: 'verify', element: <AdminVerifyPage /> },
      { path: 'notice/write', element: <NoticeWritePage /> },
      { path: 'culture/create', element: <CultureCreatePage /> }
    ]
  }
]);

export default Router;
