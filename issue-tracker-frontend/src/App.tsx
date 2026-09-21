import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Projects } from './pages/Projects';
import { ProjectIssues } from './pages/ProjectIssues';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />, // The Layout wraps everything below it!
    children: [
      {
        index: true,
        element: <Navigate to="/projects" replace />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'issues',
        element: <ProjectIssues />
      },
      // We will add more routes here later!
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
