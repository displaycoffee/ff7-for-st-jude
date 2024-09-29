/* React */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Local styles */
import './styles/container.scss';

/* Local scripts */
import { useBodyClass, useRespond } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Navigation } from '../../components/navigation/Navigation';
import { Slideout, SlideoutOverlay } from '../../components/slideout/Slideout';
import { Header } from '../../layout/header/Header';
import { Content } from '../../layout/content/Content';
import { Footer } from '../../layout/footer/Footer';

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
	const isDesktop = useRespond(theme.bps.bp04);

	// Set body class using custom hook
	useBodyClass('home');

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
				<div className="container">
					<ErrorBoundary message={<ContainerError />}>
						<SlideoutOverlay isDesktop={isDesktop} />

						{isDesktop ? (
							<Navigation location={'header'} />
						) : (
							<Slideout id={'menu'} label={'Menu'} content={<Navigation location={'slideout'} />} />
						)}

						<Header buttonClick={false} />

						<main className="main">
							<div className="main-layout">
								<Content />
							</div>
						</main>

						<Footer />
					</ErrorBoundary>
				</div>
			</Context.Provider>
		</QueryClientProvider>
	);
};

const ContainerError = () => {
	return (
		<p>
			Something went wrong. <Link to={'/'}>Go back.</Link>
		</p>
	);
};
