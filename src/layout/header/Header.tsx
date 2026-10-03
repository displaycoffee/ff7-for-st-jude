/* Styles */
import './styles/header.scss';

/* Packages */
import { Link } from '@tanstack/react-router';

/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';

export const Header = () => {
	const { variables } = useAppContext();

	return (
		<header className="header flex-wrap flex-align-center">
			<h1 className="header-title">
				<Link to={'/'} className={'no-decoration'}>
					{variables.site.name}
				</Link>
			</h1>
		</header>
	);
};
