import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import LessonPage from "../pages/LessonPage";
import PrivateRoute from "../router/PrivateRoute";
import ContactUsPage from "../pages/ContactUsPage";
import AboutPage from "../pages/AboutPage";
import NotificationsPage from "../pages/NotificationsPage";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
function AppRoute() {
  const Layout = ({ children }) => (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactUsPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout>
                  <CoursesPage />
                </Layout>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <Layout>
                  <CourseDetailPage />
                </Layout>
              }
            />
            <Route
              path="/auth/*"
              element={
                <Layout>
                  <AuthPage />
                </Layout>
              }
            />
            <Route
              path="/courses/:courseId/lessons/:lessonId?"
              element={
                <PrivateRoute>
                  <Layout>
                    <LessonPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/:tab"
              element={
                <PrivateRoute>
                  <Layout>
                    <StudentDashboardPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Layout>
                    <NotificationsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/:tab"
              element={
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoute;
