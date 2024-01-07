// Import variables from sass
import themeVars from '../styles/theme/_theme.module.scss';

export const theme = {
	bps: {
		bp01: checkSassVar(themeVars.bp01),
		bp02: checkSassVar(themeVars.bp02),
		bp03: checkSassVar(themeVars.bp03),
		bp04: checkSassVar(themeVars.bp04),
	},
	details: {
		campaign: {
			id: 'campaign',
			content: {
				header: 'Current campaign',
				name: 'Campaign',
			},
			sort: false,
			layout: {
				columns: 'whole',
				top: false,
			},
			skeleton: {
				columns: 1,
				paragraphs: 5,
			},
		},
		supporting: {
			id: 'supporting',
			content: {
				header: 'Supporting campaigns',
				name: 'Campaign',
			},
			sort: {
				field: 'total_amount_raised',
				direction: 'desc',
			},
			layout: {
				columns: 'half',
				top: false,
			},
			skeleton: {
				columns: 8,
				paragraphs: 4,
			},
		},
		previous: {
			id: 'previous',
			content: {
				header: 'Previous campaigns',
				name: 'Campaign',
			},
			sort: false,
			layout: {
				columns: 'half',
				top: false,
			},
			skeleton: {
				columns: 2,
				paragraphs: 4,
			},
		},
		donations: {
			id: 'donations',
			content: {
				header: 'Donations',
				name: 'Donation',
			},
			sort: {
				field: 'milliseconds',
				direction: 'desc',
			},
			layout: {
				columns: 'third',
				top: true,
			},
			skeleton: {
				columns: 12,
				paragraphs: 2,
			},
		},
		rewards: {
			id: 'rewards',
			content: {
				header: 'Rewards ending soon',
				name: 'Reward',
			},
			sort: {
				field: 'milliseconds',
				direction: 'asc',
			},
			layout: {
				columns: 'third',
				top: true,
			},
			skeleton: {
				columns: 12,
				paragraphs: 5,
			},
		},
		targets: {
			id: 'targets',
			content: {
				header: 'Targets ending soon',
				name: 'Target',
			},
			sort: {
				field: 'milliseconds',
				direction: 'asc',
			},
			layout: {
				columns: 'third',
				top: true,
			},
			skeleton: {
				columns: 12,
				paragraphs: 4,
			},
		},
	},
};

// Ensure an empty or undefined sass value is false
function checkSassVar(value) {
	if (value) {
		if (value == 'true') {
			return true;
		} else if (value == 'false') {
			return false;
		} else {
			let formattedValue = isNaN(value * 1) ? value.replace(/"/gi, "'") : value * 1;
			return formattedValue;
		}
	} else {
		return false;
	}
}
