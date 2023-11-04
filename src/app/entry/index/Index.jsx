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
	const { theme, useRespond } = props;
	const isDesktop = useRespond(theme.bps.bp02);

	// useEffect(() => {
	// 	requestCampaigns();
	// }, []);

	// async function requestCampaigns() {
	// 	const response = await fetch(
	// 		`http://ff7forstjude.org:5000/api/public/team_campaigns/6805c495-d02f-42ea-81d8-9b6c5ff5d3b5/supporting_campaigns/`,
	// 		{
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 		},
	// 	);
	// 	const json = await response.json();
	// 	console.log(json);
	// }

	return (
		<Context.Provider value={props}>
			<div id="top" className="wrapper">
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
