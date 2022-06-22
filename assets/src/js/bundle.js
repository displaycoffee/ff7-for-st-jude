/* react imports */
import { createRoot } from 'react-dom/client';

/* local component imports */
import Index from './components/Index';

/* create root into app entry point */
const ff7App = document.getElementById('ff7-app');
const ff7Root = createRoot(ff7App);
ff7Root.render(<Index />);
