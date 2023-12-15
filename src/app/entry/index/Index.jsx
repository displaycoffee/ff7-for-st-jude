/* React */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { useRespond } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../context/Context';
import { ErrorBoundary } from '../../shared/error-boundary/ErrorBoundary';
import { Navigation, NavigationRoutes } from '../../shared/navigation/Navigation';
import { Slideout } from '../../shared/slideout/Slideout';
import { Header } from '../../shared/header/Header';
import { Footer } from '../../shared/footer/Footer';

/* Query client for api */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			cacheTime: Infinity,
		},
	},
});

export const Index = (props) => {
	const { theme } = props;
	const isDesktop = useRespond(theme.bps.bp03);

	// Set state for query params and animals
	const [requestParams, setRequestParams] = useState({
		campaign: false,
		supporting: false,
		donations: false,
		rewards: false,
		targets: false,
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Context.Provider value={props}>
				<div className="wrapper">
					<IndexBody />

					<ErrorBoundary message={<IndexError />}>
						{isDesktop ? (
							<Navigation location={'header'} />
						) : (
							<Slideout id={'menu'} label={'Menu'} content={<Navigation location={'slideout'} />} closeOnClick={true} />
						)}

						<Header buttonClick={false} />

						<main className="main">
							<NavigationRoutes requestParams={requestParams} setRequestParams={setRequestParams} />
						</main>

						<Footer />
					</ErrorBoundary>
				</div>
			</Context.Provider>
		</QueryClientProvider>
	);
};

/* Set indexCache mostly to get previous page */
let indexCache = {
	previous: '',
};

const IndexBody = () => {
	const location = useLocation();
	const bodySelector = document.querySelector('body');
	const bodyPrefix = 'page-';

	useEffect(() => {
		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${indexCache.previous || 'index'}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		indexCache.previous = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${indexCache.previous || 'index'}`);
	}, [location]);

	return null;
};

const IndexError = () => {
	return (
		<p>
			Something went wrong. <Link to={'/'}>Go back.</Link>
		</p>
	);
};