import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import LeaderboardAd from './components/ads/LeaderboardAd.jsx';
import { Analytics } from "@vercel/analytics/react";

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home.jsx'));
const EventDetail = lazy(() => import('./pages/EventDetail.jsx'));
const CreateEvent = lazy(() => import('./pages/CreateEvent.jsx'));
const EditEvent = lazy(() => import('./pages/EditEvent.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const PostAchievement = lazy(() => import('./pages/PostAchievement.jsx'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback.jsx'));
const EditProfile = lazy(() => import('./pages/EditProfile.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='min-h-screen flex flex-col bg-white'>
          <Navbar />
          <main className='flex-1'>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </main>
          <LeaderboardAd />
          <Footer />
        </div>
      </BrowserRouter>
      <Analytics />
    </AuthProvider>
  );
}
