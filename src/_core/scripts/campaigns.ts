/* Scripts */
import { utils } from '../../../src/_core/scripts/utils';
import { variables } from '../../../src/_core/scripts/variables';

/* St. Jude FF7 campaign ids */
const ids: Record<number, string> = {
	1: 'e96852f5-6234-4c36-ab09-82de953ae6fa',
	2: 'f7e6a172-16be-40c0-9f99-3afe2eda3a3c',
	3: '3f4c8d77-43a3-4414-9ecb-25ef430f77c7',
	4: 'e9048b01-70ce-4f0a-9cc9-29c583b1a997',
	5: 'f0db38a3-df52-4f4c-8030-3b2c81db39d1',
	6: '6805c495-d02f-42ea-81d8-9b6c5ff5d3b5',
	7: 'a2308711-88cd-470c-80f5-e59286063517',
	8: '34efb69f-b259-424b-84a9-a5b7cc99dde2',
	9: '0230fcce-6d9f-4e2b-8fc1-abd7660463cd',
	10: '6437f161-1031-498c-a673-3ad5419dec34',
};

/* Get current campaign id */
const campaignIds = Object.keys(ids);
const currentId = ids[campaignIds.length];

/* Helper function to build campaign data */
const buildCampaign = (number: number, name: string, date: string, amount: number) => {
	const campaignId: string = ids[number];
	const isCurrent = campaignId == currentId;

	// Build url string
	let newUrl = `${variables.urls.team}/ff7-for-st-jude-${number}`;
	if (isCurrent) {
		newUrl = variables.urls.campaign;
	} else if (number == 4 || number == 3 || number == 2) {
		newUrl = `${variables.urls.team}/ff7-no-slots-for-st-jude-${number}`;
	} else if (number == 1) {
		newUrl = `${variables.urls.team}/ff7-no-slots-for-st-jude`;
	}

	return {
		id: campaignId,
		key: `campaign-${campaignId.split('-')[0]}-${number}`,
		name: name,
		date: date,
		campaign: newUrl,
		amounts: utils.getAmounts({ total_amount_raised: { value: amount } }),
		links: [
			{
				label: isCurrent ? newUrl.replace('https://', '').replace('//', '') : 'See campaign',
				url: newUrl,
			},
		],
	};
};

export const campaigns = {
	current: {
		...buildCampaign(10, 'FF7 for St. Jude #10', 'October 24th - 25th, 2026', 0),
	},
	previous: [
		buildCampaign(9, 'FF7 for St. Jude #9', 'February 15th, 2025', 3011.68),
		buildCampaign(8, 'FF7 for St. Jude #8', 'July 27th, 2024', 7038.69),
		buildCampaign(7, 'FF7 for St. Jude #7', 'December 16th, 2023', 7177.77),
		buildCampaign(6, 'FF7 for St. Jude #6', 'June 24, 2023', 5432.74),
		buildCampaign(5, 'FF7 for St. Jude #5', 'December 10, 2022', 9254.38),
		buildCampaign(4, 'FF7 No-Slots for St. Jude #4', 'June 25, 2022', 8770.46),
		buildCampaign(3, 'FF7 No-Slots for St. Jude #3', 'December 11, 2021', 6448.34),
		buildCampaign(2, 'FF7 No-Slots For St. Jude #2', 'June 26, 2021', 4469.69),
		buildCampaign(1, 'FF7 No-Slots For St. Jude', 'December 28, 2020', 2313.06),
	],
};
