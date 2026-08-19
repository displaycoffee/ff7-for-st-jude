/* Packages */
import { AnchorHTMLAttributes, OlHTMLAttributes, ReactNode } from 'react';

/* Type definitions */
type LinkExternal = {
	children: ReactNode;
	className?: string;
	href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'rel' | 'target'>;

type List = {
	children: ReactNode;
	className?: string;
	variant?: 'ol' | 'ol-unstyled' | 'ul' | 'ul-unstyled';
} & Omit<OlHTMLAttributes<HTMLOListElement>, 'children' | 'className' | 'variant'>;

type Section = {
	children: ReactNode;
	className?: string;
	hasRow?: boolean;
	hasScroll?: boolean;
	id?: string;
	title?: string;
};

type SectionLinks = {
	links: LinksType[];
	wrapper?: boolean;
};

type SectionNotFound = {
	type: string;
};

type SectionParagraph = {
	content?: string | boolean;
	label: string;
};

type Skeleton = {
	columns: number;
	paragraphs: number;
	perRow: number;
};

/* Export prop types */
export type LinkExternalProps = LinkExternal;

export type ListProps = List;

export type SectionProps = Section;

export type SectionLinksProps = SectionLinks;

export type SectionNotFoundProps = SectionNotFound;

export type SectionParagraphProps = SectionParagraph;

export type SkeletonProps = Skeleton;
