/* Styles */
import './styles/footer.scss';

/* Components */
import { LinkExternal } from '../../components/blocks/Blocks';

export const Footer = () => {
	return (
		<footer className="footer">
			<p className="credits">
				Created by <LinkExternal href="//display.coffee">displaycoffee</LinkExternal>. Built and organized with{' '}
				<LinkExternal href="//tiltify.com">tiltify</LinkExternal>.
			</p>
		</footer>
	);
};
