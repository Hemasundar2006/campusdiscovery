import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import LeaderboardAd from './components/ads/LeaderboardAd.jsx';
import Home from './pages/Home.jsx';
import EventDetail from './pages/EventDetail.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import EditEvent from './pages/EditEvent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostAchievement from './pages/PostAchievement.jsx';
import GoogleCallback from './pages/GoogleCallback.jsx';
import EditProfile from './pages/EditProfile.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='min-h-screen flex flex-col bg-white'>
          <Navbar />
          <main className='flex-1'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/events/:id' element={<EventDetail />} />
              <Route path='/login' element={<Login />} />
              <Route path='/admin-login' element={<AdminLogin />} />
              <Route path='/register' element={<Register />} />
              <Route
                path='/events/create'
                element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}
              />
              <Route
                path='/events/:id/edit'
                element={<ProtectedRoute><EditEvent /></ProtectedRoute>}
              />
              <Route
                path='/dashboard'
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path='/admin'
                element={<AdminRoute><AdminDashboard /></AdminRoute>}
              />
              <Route
                path='/achievements/post'
                element={<ProtectedRoute><PostAchievement /></ProtectedRoute>}
              />
              <Route
                path='/profile/edit'
                element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
              />
              <Route path='/auth/callback' element={<GoogleCallback />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <LeaderboardAd />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
