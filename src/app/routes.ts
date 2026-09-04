import { createBrowserRouter } from 'react-router';
import Root from '../components/Root';
import Home from '../pages/Home';
import About from '../pages/About';
import Academics from '../pages/Academics';
import Infrastructure from '../pages/Infrastructure';
import Gallery from '../pages/Gallery';
import Notices from '../pages/Notices';
import Contact from '../pages/Contact';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'academics', Component: Academics },
      { path: 'infrastructure', Component: Infrastructure },
      { path: 'gallery', Component: Gallery },
      { path: 'notices', Component: Notices },
      { path: 'contact', Component: Contact },
      { path: 'admin', Component: Admin },
      { path: '*', Component: NotFound },
    ],
  },
]);
