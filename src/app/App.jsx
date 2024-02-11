/* React */
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

/* Local scripts */
import { campaigns } from './_config/scripts/campaigns';
import { theme } from './_config/scripts/theme';
import { utils } from './_config/scripts/utils';
import { variables } from './_config/scripts/variables';

/* Local components */
import { Index } from './entry/index/Index';

/* App component */
const App = () => {
	return (
		<Router basename={variables.paths.base}>
			<Index campaigns={campaigns} theme={theme} utils={utils} variables={variables} />
		</Router>
	);
};

/* Create root into app entry point */
const rootElement = document.getElementById('root');
const rootHasChildren = rootElement && rootElement?.children && rootElement.children.length !== 0 ? true : false;
if (!rootHasChildren) {
	const rootTarget = createRoot(rootElement);
	rootTarget.render(<App />);
}
