import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import PricingPage from './pages/PricingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path='/services' element={<ServicesPage />} />
                <Route path='/portfolio' element={<PortfolioPage />} />
                <Route path='/pricing' element={<PricingPage />} />

                {/* Citizen dashboard */}
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <CitizenDashboard />
                    </ProtectedRoute>
                } />

                {/* Admin & Officer dashboard — staffOnly allows both roles */}
                <Route path='/admin-dashboard' element={
                    <ProtectedRoute staffOnly={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Profile — any logged-in user */}
                <Route path='/profile' element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

export default App;
