/* Import variables from sass */
import themeVars from '../styles/theme/_theme.module.scss';

export const theme: ThemeType = {
	bps: {
		bp01: checkSassVar(themeVars.bp01),
		bp02: checkSassVar(themeVars.bp02),
		bp03: checkSassVar(themeVars.bp03),
		bp04: checkSassVar(themeVars.bp04),
	},
	colors: {
		color01: checkSassVar(themeVars.color01),
		color02: checkSassVar(themeVars.color02),
		color03: checkSassVar(themeVars.color03),
		color04: checkSassVar(themeVars.color04),
		color05: checkSassVar(themeVars.color05),
		color06: checkSassVar(themeVars.color06),
		color07: checkSassVar(themeVars.color07),
		color08: checkSassVar(themeVars.color08),
		color09: checkSassVar(themeVars.color09),
		color10: checkSassVar(themeVars.color10),
		color11: checkSassVar(themeVars.color11),
		color12: checkSassVar(themeVars.color12),
		color13: checkSassVar(themeVars.color13),
		color14: checkSassVar(themeVars.color14),
		color15: checkSassVar(themeVars.color15),
		color16: checkSassVar(themeVars.color16),
		color17: checkSassVar(themeVars.color17),
		color18: checkSassVar(themeVars.color18),
	},
	details: {
		campaign: {
			id: 'campaign',
			content: {
				header: 'Current campaign',
				name: 'Campaign',
			},
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

/* Ensure an empty or undefined sass value is false */
function checkSassVar(value: string) {
	if (value) {
		if (value === 'true') {
			return true;
		} else if (value === 'false') {
			return false;
		} else {
			const valueAsNumber = Number(value);
			const formattedValue = isNaN(valueAsNumber) ? value.replace(/"/gi, "'") : valueAsNumber;
			return formattedValue;
		}
	} else {
		return false;
	}
}
