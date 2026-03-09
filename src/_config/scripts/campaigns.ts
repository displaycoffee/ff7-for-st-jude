/* Local scripts */
import { utils } from '../../../src/_config/scripts/utils';
import { variables } from '../../../src/_config/scripts/variables';

/* St. Jude FF7 campaign ids */
const ids = {
	1: 'e96852f5-6234-4c36-ab09-82de953ae6fa',
	2: 'f7e6a172-16be-40c0-9f99-3afe2eda3a3c',
	3: '3f4c8d77-43a3-4414-9ecb-25ef430f77c7',
	4: 'e9048b01-70ce-4f0a-9cc9-29c583b1a997',
	5: 'f0db38a3-df52-4f4c-8030-3b2c81db39d1',
	6: '6805c495-d02f-42ea-81d8-9b6c5ff5d3b5',
	7: 'a2308711-88cd-470c-80f5-e59286063517',
	8: '34efb69f-b259-424b-84a9-a5b7cc99dde2',
	9: '0230fcce-6d9f-4e2b-8fc1-abd7660463cd',
};

export const campaigns = {
	current: {
		id: ids[9],
		name: 'FF7 for St. Jude #9',
		date: 'February 15th, 2025',
		amounts: utils.getAmounts({ total_amount_raised: { value: 0 } }),
		links: [
			{
				label: variables.urls.campaign.replace('https://', '').replace('//', ''),
				url: variables.urls.campaign,
			},
		],
	},
	previous: [
		{
			id: ids[8],
			name: 'FF7 for St. Jude #8',
			date: 'July 27th, 2024',
			amounts: utils.getAmounts({ total_amount_raised: { value: 7038.69 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-for-st-jude-8`,
				},
			],
		},
		{
			id: ids[7],
			name: 'FF7 for St. Jude #7',
			date: 'December 16th, 2023',
			amounts: utils.getAmounts({ total_amount_raised: { value: 7177.77 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-for-st-jude-7`,
				},
			],
		},
		{
			id: ids[6],
			name: 'FF7 for St. Jude #6',
			date: 'June 24, 2023',
			amounts: utils.getAmounts({ total_amount_raised: { value: 5397.74 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-for-st-jude-6`,
				},
			],
		},
		{
			id: ids[5],
			name: 'FF7 for St. Jude #5',
			date: 'December 10, 2022',
			amounts: utils.getAmounts({ total_amount_raised: { value: 9254.38 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-for-st-jude-5`,
				},
			],
		},
		{
			id: ids[4],
			name: 'FF7 No-Slots for St. Jude #4',
			date: 'June 25, 2022',
			amounts: utils.getAmounts({ total_amount_raised: { value: 8770.46 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-4`,
				},
			],
		},
		{
			id: ids[3],
			name: 'FF7 No-Slots for St. Jude #3',
			date: 'December 11, 2021',
			amounts: utils.getAmounts({ total_amount_raised: { value: 6448.34 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-3`,
				},
			],
		},
		{
			id: ids[2],
			name: 'FF7 No-Slots For St. Jude #2',
			date: 'June 26, 2021',
			amounts: utils.getAmounts({ total_amount_raised: { value: 4469.69 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude-2`,
				},
			],
		},
		{
			id: ids[1],
			name: 'FF7 No-Slots For St. Jude',
			date: 'December 28, 2020',
			amounts: utils.getAmounts({ total_amount_raised: { value: 2313.06 } }),
			links: [
				{
					label: 'See campaign',
					url: `${variables.urls.team}/ff7-no-slots-for-st-jude`,
				},
			],
		},
	],
};
