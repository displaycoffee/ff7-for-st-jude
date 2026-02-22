/* Export types */
export type ContextValuesType = {
	campaigns: {
		current: CampaignType;
		previous: CampaignType[];
	};
	theme: {
		[key: string]: ObjectPrimitiveType;
	};
	utils: {
		[key: string]: Function;
	};
	variables: {
		[key: string]: ObjectPrimitiveType;
	};
};

/* Export prop types */
export type ContextProps = {
	children: ReactNode;
};
