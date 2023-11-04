/* local component imports */
import { Header } from '../elements/Header';
import { Navigation } from '../elements/Navigation';
import { Details } from '../elements/Details';

export const NewGame = (props) => {
	let { buttonClick, campaign, config, previous, supporting } = props;
	const { navigation, theme, utils } = config;

	return (
		<>
			<Header buttonClick={buttonClick} />

			{/* main details */}

			<Navigation links={navigation.newGame} />

			<Details details={campaign} settings={theme.details.campaign} utils={utils} />

			<Details details={supporting} settings={theme.details.supporting} utils={utils} />

			<Details details={previous} settings={theme.details.previous} utils={utils} />
		</>
	);
};
