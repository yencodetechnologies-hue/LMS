import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Courses from './pages/Courses';
import CourseDocuments from './components/CourseDocuments';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import MyCourses from './pages/MyCourses';
import RtoProfile from './pages/RtoProfile';
import JobPackView from './pages/JobPackView';
import KnowledgeAssessmentView from './pages/KnowledgeAssessmentView';
import KnowledgeAnswerGuideView from './pages/KnowledgeAnswerGuideView'
import RtoUserManagement from './components/RtoUserManagement';
import RtoTeacherManagement from './pages/RtoTeacherManagement';
import RtoStudentManagement from './components/RtoStudentManagement';

function App() {   
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/jobpack/:rtoNumber/:courseId" element={<JobPackView />} />
        <Route path="/assessment/knowledge/:rtoNumber/:courseId" element={<KnowledgeAssessmentView />} />
        <Route path="/knowledge-answer/:rtoNumber/:courseId" element={<KnowledgeAnswerGuideView />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

         <Route
          path="/dashboard/rto"
          element={
            <ProtectedRoute>
              <RtoUserManagement />
            </ProtectedRoute>
          }
        />

         <Route
          path="/dashboard/rto/teacher"
          element={
            <ProtectedRoute>
              <RtoTeacherManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/rto/student"
          element={
            <ProtectedRoute>
              <RtoStudentManagement />
            </ProtectedRoute>
          }
        />
        <Route path="dashboard/rto-profile" element={<RtoProfile />} />
         <Route
          path="/dashboard/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* Manage Documents Route */}
        <Route
          path="/dashboard/courses/:courseId/documents"
          element={
            <ProtectedRoute>
              <CourseDocuments />
            </ProtectedRoute>
          }
        />

        {/* Fallback in case navigated without /dashboard */}
        <Route
          path="/courses/:courseId/documents"
          element={
            <ProtectedRoute>
              <CourseDocuments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;