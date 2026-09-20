import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />, // Redirect root to login
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
