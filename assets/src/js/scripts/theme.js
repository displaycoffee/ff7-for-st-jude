// import variables from sass
import themeVars from '../../scss/modules/theme.module.scss';

export const theme = {
	bps: {
		bp1: checkSassVar(themeVars.bp01),
		bp2: checkSassVar(themeVars.bp02),
		bp3: checkSassVar(themeVars.bp03),
		bp4: checkSassVar(themeVars.bp04),
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
				field: 'totalAmountRaised',
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
				field: 'completedAt',
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
				field: 'endsAt',
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
		challenges: {
			id: 'challenges',
			content: {
				header: 'Challenges ending soon',
				name: 'Challenge',
			},
			sort: {
				field: 'endsAt',
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

// ensure an empty or undefined sass value is false
function checkSassVar(value) {
	if (value && value != 'false') {
		let formattedValue = isNaN(parseInt(value)) ? value.replace(/\"/gi, '') : parseInt(value);
		return formattedValue;
	} else {
		return false;
	}
}
