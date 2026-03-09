/* Type definitions */
type Details = {
	children?: ReactNode;
	hasRow?: boolean;
	header?: string;
	scrollLink?: boolean;
};

type DetailsLinks = {
	links: LinksType[];
	wrapper?: boolean;
};

type DetailsNotFound = {
	type: string;
};

type DetailsParagraph = {
	content?: string | boolean;
	label: string;
};

/* Export prop types */
export type DetailsProps = Details;

export type DetailsLinksProps = DetailsLinks;

export type DetailsNotFoundProps = DetailsNotFound;

export type DetailsParagraphProps = DetailsParagraph;
