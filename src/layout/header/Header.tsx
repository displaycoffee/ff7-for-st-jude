/* Styles */
import './styles/header.scss';

/* Packages */
import { Link } from 'react-router-dom';

export const Header = () => {
	return (
		<header className="header flex-wrap flex-align-center">
			<h1 className="header-title">
				<Link to="/" title="FF7 for St. Jude">
					FF7 for St. Jude
				</Link>
			</h1>
		</header>
	);
};
