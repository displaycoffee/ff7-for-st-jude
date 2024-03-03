/* React */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Local styles */
import './styles/container.scss';

/* Local scripts */
import { useRespond } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../entry/context/Context';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Navigation, NavigationRoutes } from '../../components/navigation/Navigation';
import { Slideout } from '../../components/slideout/Slideout';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';

/* Query client for api */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			cacheTime: Infinity,
		},
	},
});

export const Container = (props) => {
	const { theme } = props;
	const isDesktop = useRespond(theme.bps.bp03);

	// Create state for app
	let [content, setContent] = useState({
		campaign: false,
		supporting: false,
		donations: false,
		rewards: false,
		targets: false,
	});

	// Include queryClient in props
	const contextProps = {
		...props,
		queryClient,
		content: content,
		setContent: setContent,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<Context.Provider value={contextProps}>
				<div className="wrapper">
					<ContainerBody />

					<ErrorBoundary message={<ContainerError />}>
						{isDesktop ? (
							<Navigation location={'header'} />
						) : (
							<Slideout id={'menu'} label={'Menu'} content={<Navigation location={'slideout'} />} closeOnClick={true} />
						)}

						<Header buttonClick={false} />

						<main className="main">
							<NavigationRoutes />
						</main>

						<Footer />
					</ErrorBoundary>
				</div>
			</Context.Provider>
		</QueryClientProvider>
	);
};

/* Set containerCache mostly to get previous page */
let containerCache = {
	previous: '',
};

const ContainerBody = () => {
	const location = useLocation();
	const bodySelector = document.querySelector('body');
	const bodyPrefix = 'page-';
	const bodyDefault = 'home';

	useEffect(() => {
		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${containerCache.previous || bodyDefault}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		containerCache.previous = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${containerCache.previous || bodyDefault}`);
	}, [location]);

	return null;
};

const ContainerError = () => {
	return (
		<p>
			Something went wrong. <Link to={'/'}>Go back.</Link>
		</p>
	);
};
