import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import ManageSections from "./pages/ManageSections";
import ManageLessons from "./pages/ManageLessons";
import ManageQuizzes from "./pages/ManageQuizzes";
import AdminCertificates from "./pages/AdminCertificates";
import StudentQuizzes from "./pages/StudentQuizzes";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
// import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import AdminCourseProgress from "./pages/AdminCourseProgress";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import ScrollTop from "./components/ScrollTop/ScrollTop";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";

function App() {

    return (
<>
<ThemeToggle/>

<ScrollTop/>
        <Routes>

            <Route element={<MainLayout />}>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/course/:id/watch/:lessonId?" element={<Lesson />} />
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/my-learning" element={<StudentDashboard />} />
                    <Route path="/lesson/:id" element={<Lesson />} />
                    <Route path="/quiz/:id" element={<Quiz />} />
                    <Route path="/quizzes" element={<StudentQuizzes />} />
                    <Route path="/certificate" element={<Certificate />} />
                </Route>

            </Route>

            <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="courses/new" element={<CreateCourse />} />
                    <Route path="sections" element={<ManageSections />} />
                    <Route path="lessons" element={<ManageLessons />} />
                    <Route path="quizzes" element={<ManageQuizzes />} />
                    <Route path="certificates" element={<AdminCertificates />} />
                    <Route path="courses/progress/:courseId?" element={<AdminCourseProgress />} />
                    <Route path="users" element={<Users />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Route>
        </Routes>
        <Toaster />
        </>

    );

}

export default App;