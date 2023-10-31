/* React */
import { useState } from 'react';

export const utils = {
	handleize: (value) => {
		// Format value for html classes
		return value
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-')
			.trim();
	},
	respond: (bp) => {
		const rule = window.matchMedia(`(min-width: ${bp}px)`);
		let [match, setMatch] = useState(rule.matches);

		// Update match state on media change
		rule.onchange = (e) => {
			if (e.matches) {
				match = true;
			} else {
				match = false;
			}
			setMatch(match);
		};

		return match;
	},
};
