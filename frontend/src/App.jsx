import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './utils/auth';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Feed       from './pages/Feed';
import BlogPost   from './pages/BlogPost';
import CreateBlog from './pages/CreateBlog';

import ForgotPassword from './pages/ForgotPassword';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path="/feed"     element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogPost /></ProtectedRoute>} />
        <Route path="/create"   element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={isLoggedIn() ? '/feed' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
