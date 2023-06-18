/* local script imports */
import { variables } from './_variables';

/* st. jude ff7 campaign ids */
const campaignIds = {
	1: 'e96852f5-6234-4c36-ab09-82de953ae6fa',
	2: 'f7e6a172-16be-40c0-9f99-3afe2eda3a3c',
	3: '3f4c8d77-43a3-4414-9ecb-25ef430f77c7',
	4: 'e9048b01-70ce-4f0a-9cc9-29c583b1a997',
	5: 'f0db38a3-df52-4f4c-8030-3b2c81db39d1',
	6: '6805c495-d02f-42ea-81d8-9b6c5ff5d3b5',
};

export const campaigns = {
	current: {
		id: campaignIds[6],
		name: 'FF7 for St. Jude #6',
		date: 'June 24, 2023',
		links: [
			{
				label: `${variables.urls.team.replace('https://', '')}/ff7-for-st-jude-6`,
				url: `${variables.urls.team}/ff7-for-st-jude-6`,
			},
		],
	},
	previous: [
		{
			id: campaignIds[5],
			name: 'FF7 for St. Jude #5',
			total_amount_raised: { value: 9254.38, currency: 'USD' },
			date: 'December 10, 2022',
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-for-st-jude-5`,
				},
			],
		},
		{
			id: campaignIds[4],
			name: 'FF7 No-Slots for St. Jude #4',
			total_amount_raised: { value: 8770.46, currency: 'USD' },
			date: 'June 25, 2022',
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-4`,
				},
			],
		},
		{
			id: campaignIds[3],
			name: 'FF7 No-Slots for St. Jude #3',
			total_amount_raised: { value: 6448.34, currency: 'USD' },
			date: 'December 11, 2021',
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-3`,
				},
			],
		},
		{
			id: campaignIds[2],
			name: 'FF7 No-Slots For St. Jude #2',
			total_amount_raised: { value: 4469.69, currency: 'USD' },
			date: 'June 26, 2021',
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-2`,
				},
			],
		},
		{
			id: campaignIds[1],
			name: 'FF7 No-Slots For St. Jude',
			total_amount_raised: { value: 2313.06, currency: 'USD' },
			date: 'December 28, 2020',
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude`,
				},
			],
		},
	],
};