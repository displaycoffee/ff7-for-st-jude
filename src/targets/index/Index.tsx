/* React */
import { BrowserRouter } from 'react-router-dom';

/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { utils } from '../../_config/scripts/utils';
import { variables } from '../../_config/scripts/variables';

/* Local components */
import { ContextProvider } from '../../context/Context';
import { Container } from '../../layout/container/Container';

/* Index component */
const Index = () => {
	return (
		<BrowserRouter basename={variables.paths.basename}>
			<ContextProvider>
				<Container />
			</ContextProvider>
		</BrowserRouter>
	);
};

/* Create main target entry point */
utils.renderTarget('#index', <Index />);
