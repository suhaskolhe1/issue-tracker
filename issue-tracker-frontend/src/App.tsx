import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import {Login} from './pages/Login';
import {Layout} from './components/Layout';
import {Projects} from './pages/Projects';
import {ProjectIssues} from './pages/ProjectIssues';
import {IssueDetail} from "./pages/IssueDetail.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";
import {OAuth2Redirect} from "./pages/OAuth2Redirect.tsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/oauth2/redirect',
        element: <OAuth2Redirect/>,
    },
    {
        path: '/',
        element: <Layout/>, // The Layout wraps everything below it!
        children: [
            {
                index: true,
                element: <Navigate to="/projects" replace/>
            },
            {
                path: 'projects',
                element: <Dashboard/>
            },
            {
                path: 'issues',
                element: <ProjectIssues/>
            },
            {
                path: 'issues/:id',
                element: <IssueDetail/>
            },]
    }
]);

export function App() {
    return <RouterProvider router={router}/>;
}
