/* React */
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Local styles */
import './styles/index.scss';

/* Local components */
import { Context } from '../context/Context';
import { ErrorBoundary } from '../../shared/error-boundary/ErrorBoundary';
import { Navigation, NavigationRoutes } from '../../shared/navigation/Navigation';
import { Slideout } from '../../shared/slideout/Slideout';
import { Header } from '../../shared/header/Header';
import { Footer } from '../../shared/footer/Footer';

export const Index = (props) => {
	const { theme, utils } = props;
	const isDesktop = utils.respond(theme.bps.bp02);

	return (
		<Context.Provider value={props}>
			<div className="wrapper">
				<IndexBody />

				<ErrorBoundary message={<IndexError />}>
					{isDesktop ? <Navigation /> : <Slideout id={'menu'} label={'Menu'} content={<Navigation />} closeOnClick={true} />}

					<Header buttonClick={false} />

					<main className="main">
						<NavigationRoutes />
					</main>

					<Footer />
				</ErrorBoundary>
			</div>
		</Context.Provider>
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
