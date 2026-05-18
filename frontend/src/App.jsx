import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Businesses from './pages/Businesses';
import BusinessDetails from './pages/BusinessDetails';
import CategoriesPage from './pages/CategoriesPage';
import About from './pages/About';
import Payment from './pages/Payment';
import Contact from './pages/Contact';
import AddBusiness from './pages/AddBusiness';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBusinesses from './pages/admin/AdminBusinesses';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPayments from './pages/admin/AdminPayments';
import AdminPending from './pages/admin/AdminPending';
import AdminAnalytics from './pages/admin/AdminAnalytics';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'dark:!bg-slate-800 dark:!text-white dark:!border-slate-700',
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:id" element={<BusinessDetails />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/add-business" element={<AddBusiness />} />
          <Route path="/404" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="businesses" element={<AdminBusinesses />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="pending" element={<AdminPending />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
