// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import AdminDashboard from './Components/AdminDashboard';
import Skills from './Admin/Skills';
import UserDashboard from './Components/UserDashboard';
import UserSkillList from './User/UserSkillList';
import MySkillList from './User/MySkillList';
import GoalPage from './User/GoalPage';
import CertificateButton from './User/CertificateButton';
import PrivateRoute from './Routes/PrivateRoute';
import Navbar from './Components/Navbar';
import Resources from './Components/Resources';
import FeedbackForm from './Components/Feedbackform';
import AddResource from './Admin/AddResource';
import FeedbackList from './Admin/FeedbackList';
import UserResourceList from './Components/UserResourceList';
import AdminResourceList from './Admin/AdminResourceList';
import AdminSkillList from './Admin/AdminSkillList';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/addresource"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AddResource />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin/adminresourcelist"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminResourceList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/adminskilllist"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminSkillList />
            </PrivateRoute>
          }
          />

        <Route
          path="/userresourceslist"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserResourceList />
            </PrivateRoute>
          }
        />

         <Route
          path="admin/feedbacklist"
          element={
            <PrivateRoute allowedRoles={[ "admin"]}>
              <FeedbackList />
            </PrivateRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <PrivateRoute allowedRoles={["user", "admin"]}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />

        

        <Route path="/courses" element={<Resources />} />
        <Route path="/admin/skills" element={<Skills />} />

        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/user/UserSkillList" element={<UserSkillList />} />
        <Route path="/user/MySkills" element={<MySkillList />} />
        <Route path="/goals" element={<GoalPage />} />
        <Route path="/certificate" element={<CertificateButton />} />
      </Routes>
    </Router>
  );
}

export default App;
