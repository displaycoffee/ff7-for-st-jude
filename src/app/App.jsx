/* React */
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

/* Local scripts */
import { requests } from './_config/scripts/requests';
import { theme } from './_config/scripts/theme';
import { utils } from './_config/scripts/utils';
import { variables } from './_config/scripts/variables';

/* Local components */
import { Index } from './entry/index/Index';

/* App component */
const App = () => {
	return (
		<Router basename={variables.paths.base}>
			<Index requests={requests} theme={theme} utils={utils} variables={variables} />
		</Router>
	);
};

/* Create root into app entry point */
const rootElement = document.getElementById('root');
const rootTarget = createRoot(rootElement);
rootTarget.render(<App />);
