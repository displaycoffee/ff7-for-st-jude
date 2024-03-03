/* React */
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

/* Local scripts */
import { campaigns } from '../../_config/scripts/campaigns';
import { theme } from '../../_config/scripts/theme';
import { utils } from '../../_config/scripts/utils';
import { variables } from '../../_config/scripts/variables';

/* Local components */
import { Container } from '../../layout/container/Container';

/* Index component */
const Index = () => {
	return (
		<Router basename={variables.paths.basename}>
			<Container campaigns={campaigns} theme={theme} utils={utils} variables={variables} />
		</Router>
	);
};

/* Create root into app entry point */
const rootElement = document.getElementById('root');
const rootHasChildren = rootElement && rootElement?.children && rootElement.children.length !== 0 ? true : false;
if (!rootHasChildren) {
	const rootTarget = createRoot(rootElement);
	rootTarget.render(<Index />);
}
