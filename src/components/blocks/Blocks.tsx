/* Styles */
import './styles/blocks.scss';

/* Packages */
import { Fragment, useEffect, useRef } from 'react';

/* Scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import {
	LinkExternalProps,
	ListProps,
	SectionProps,
	SectionLinksProps,
	SectionNotFoundProps,
	SectionParagraphProps,
	SkeletonProps,
} from './scripts/blocks-types';
import { blocks } from './scripts/blocks';

/* Components */
import { ButtonScroll } from '../forms/Forms';

export const LinkExternal = (props: LinkExternalProps) => {
	const { children, className, href, ...rest } = props;

	return (
		<a className={className} href={href} target="_blank" rel="noreferrer" {...rest}>
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
};

export const List = (props: ListProps) => {
	const { children, className: propClassName, reversed, start, type: listType, variant = 'ul', ...rest } = props;
	const isOrdered = variant.includes('ol');
	const isUnstyled = variant.includes('unstyled');
	const Tag = isOrdered ? 'ol' : 'ul';
	const classes = `list-${isUnstyled ? 'unstyled' : isOrdered ? 'ordered' : 'unordered'}`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const olAttributes = isOrdered ? { reversed, start, type: listType } : {};

	return (
		<Tag className={className} {...rest} {...olAttributes}>
			{children}
		</Tag>
	);
};

export const Section = (props: SectionProps) => {
	const { children, className: propClassName, hasRow = false, hasScroll = true, id, title } = props;
	const { utils } = useAppContext();
	const fallbackId = useFormattedId();
	const sectionId = `section-${id ? id : title ? utils.handleize(title) : fallbackId}`;
	const classes = `section ${sectionId} margin-trim`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const sectionRef = useRef<HTMLElement>(null);

	// Reveal section with a fade / scroll transition once it comes into view
	useEffect(() => {
		blocks.reveal(sectionRef.current, 'section-visible');
	}, []);

	return (
		<section id={sectionId} className={className} tabIndex={-1} ref={sectionRef}>
			{title ? <h2 className="section-title">{title}</h2> : null}

			<div className={`section-content${hasRow ? '' : ' margin-trim gradient-section'}`}>{children}</div>

			{hasScroll ? (
				<div className="section-button">
					<ButtonScroll target="#index" label="^ Back to top" aria-label="Back to Top Button" />
				</div>
			) : null}
		</section>
	);
};

export const SectionParagraph = (props: SectionParagraphProps) => {
	const { content, label } = props;

	return content ? (
		<p>
			<strong>{label}:</strong> {content}
		</p>
	) : null;
};

export const SectionLinks = (props: SectionLinksProps) => {
	const { links, wrapper } = props;
	const hasWrapper = !wrapper && wrapper !== false;

	// Create loop for links
	const linksLoop = links.map((link, index) => (
		<Fragment key={link.url}>
			<LinkExternal href={link.url}>{link.label}</LinkExternal>

			{index != links.length - 1 && <br />}
		</Fragment>
	));

	return links && links.length != 0 ? hasWrapper ? <div className="section-links">{linksLoop}</div> : linksLoop : null;
};

export const SectionNotFound = (props: SectionNotFoundProps) => {
	const { type } = props;

	return (
		<div className="column column-width-100">
			<div className="gradient-section">
				<p role="status">No {type} found.</p>
			</div>
		</div>
	);
};

export const Skeleton = (props: SkeletonProps) => {
	const { columns, paragraphs, perRow } = props;

	// Function to build details in skeleton
	const buildSkeleton = (length: number) => {
		const skeleton = [];
		for (let i = 0; i < length; i++) {
			skeleton.push(i);
		}
		return skeleton;
	};

	// Create list of skeletons
	const skeletonColumns = buildSkeleton(columns);
	const skeletonParagraphs = buildSkeleton(paragraphs);

	return skeletonColumns.map((c, index) => (
		<div className={`column column-width-${Math.floor(100 / perRow)} column-skeleton`} key={c + index} aria-hidden="true">
			<div className="gradient-section">
				{skeletonParagraphs.map((p, index) => {
					return <p key={p + index}>&nbsp;</p>;
				})}
			</div>
		</div>
	));
};
