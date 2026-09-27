/* Scripts */
import { breakpoints } from '../data/breakpoints';
import { colors } from '../data/colors';

export const theme: ThemeType = {
	breakpoints: breakpoints,
	colors: colors,
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
