
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import FullMenu from './pages/FullMenu';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/booking',
    element: <Booking />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/menu',
    element: <FullMenu />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
