/* Type definitions */
type PreviousSortBy = 'amount' | 'number';

type PreviousSort = {
	by: PreviousSortBy;
	direction: 'asc' | 'desc';
};

type PreviousSortOptions = {
	by: PreviousSortBy;
	label: string;
}[];

/* Export types */
export type PreviousSortType = PreviousSort;

export type PreviousSortOptionsType = PreviousSortOptions;
