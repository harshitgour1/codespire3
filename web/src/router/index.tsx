import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import ScreenshotSearch from '@/pages/ScreenshotSearch';
import Timeline from '@/pages/Timeline';
import KnowledgeGraph from '@/pages/KnowledgeGraph';
import DocumentViewer from '@/pages/DocumentViewer';
import Meetings from '@/pages/Meetings';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'screenshot', element: <ScreenshotSearch /> },
      { path: 'timeline', element: <Timeline /> },
      { path: 'graph', element: <KnowledgeGraph /> },
      { path: 'document/:id', element: <DocumentViewer /> },
      { path: 'meetings', element: <Meetings /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
