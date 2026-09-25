/* Styles */
import './styles/container.scss';

/* Packages */
import { useRef } from 'react';
import { Link } from '@tanstack/react-router';

/* Scripts */
import { useRespond } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { useAvailableMinHeight, useBodyClass } from './scripts/container-hooks';
import { navigationHeader } from '../../components/navigation/scripts/navigation';

/* Components */
import { Colors } from '../../components/colors/Colors';
import { Navigation } from '../../components/navigation/Navigation';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Slideout } from '../../components/slideout/Slideout';
import { Header } from '../header/Header';
import { Content } from '../content/Content';
import { Footer } from '../footer/Footer';

export const Container = () => {
	const { theme } = useAppContext();
	const isDesktop = useRespond(theme.bps.bp02 as number);
	const mainRef = useRef<HTMLElement>(null);
	useAvailableMinHeight(mainRef);

	// Set body class using custom hook
	useBodyClass('home');

	// Slideout options
	const slideoutOptions = {
		id: 'menu',
		label: 'Menu',
	};

	return (
		<div className="container">
			<ErrorBoundary message={<ContainerError />}>
				<Colors showButton={false} />

				<a href="#main-content" className="skip-link sr-only">
					Skip to main content
				</a>

				{isDesktop ? (
					<Navigation data={navigationHeader} disableTransition={true} label={'Header Navigation'} location={'header'} />
				) : (
					<Slideout options={slideoutOptions}>
						<Navigation data={navigationHeader} disableTransition={true} label={'Mobile Navigation'} location={'slideout'} />
					</Slideout>
				)}

				<Header />

				<main id="main-content" className="main" ref={mainRef}>
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
