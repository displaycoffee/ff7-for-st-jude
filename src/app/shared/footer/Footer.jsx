/* Local styles */
import './styles/footer.scss';

export const Footer = () => {
	return (
		<footer className="credits">
			Created by{' '}
			<a href="//display.coffee" target="_blank" rel="noreferrer">
				displaycoffee
			</a>
			. Built and organized with{' '}
			<a href="//tiltify.com" target="_blank" rel="noreferrer">
				tiltify
			</a>
			.
		</footer>
	);
};
