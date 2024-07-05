/* React */
import { Link } from 'react-router-dom';

/* Local styles */
import './styles/header.scss';

export const Header = () => {
	return (
		<header className="header flex-wrap flex-align-center">
			<h1 className="header-title">
				<Link to="/" alt="FF7 for St. Jude" title="FF7 for St. Jude">
					FF7 for St. Jude
				</Link>
			</h1>
		</header>
	);
};
