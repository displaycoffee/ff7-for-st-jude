/* Styles */
import './styles/container.scss';

/* Packages */
import { Link } from 'react-router-dom';

/* Scripts */
import { useRespond } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { useBodyClass } from './scripts/container-hooks';

/* Components */
import { Colors } from '../../components/colors/Colors';
import { Navigation } from '../../components/navigation/Navigation';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Slideout, SlideoutOverlay } from '../../components/slideout/Slideout';
import { Header } from '../header/Header';
import { Content } from '../content/Content';
import { Footer } from '../footer/Footer';

export const Container = () => {
	const { theme } = useAppContext();
	const isDesktop = useRespond(theme.bps.bp02 as number);

	// Set body class using custom hook
	useBodyClass('home');

	// Slideout options
	const slideoutOptions = {
		id: 'menu',
		isDesktop: isDesktop,
		label: 'Menu',
		button: {
			outside: false,
			show: true,
		},
	};

	return (
		<div className="container">
			<ErrorBoundary message={<ContainerError />}>
				<Colors showButton={false} />

				<SlideoutOverlay options={slideoutOptions} />

				<a href="#main-content" className="skip-link sr-only">
					Skip to main content
				</a>

				{isDesktop ? (
					<Navigation label={'Header Navigation'} location={'header'} />
				) : (
					<Slideout options={slideoutOptions}>
						<Navigation label={'Mobile Navigation'} />
					</Slideout>
				)}

				<Header />

				<main id="main-content" className="main">
					<div className="main-layout flex-wrap">
						<Content />
					</div>
				</main>

				<Footer />
			</ErrorBoundary>
		</div>
	);
};

const ContainerError = () => {
	return (
		<p>
			Something went wrong. <Link to={'/'}>Go back.</Link>
		</p>
	);
};
