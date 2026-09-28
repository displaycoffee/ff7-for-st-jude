/* Scripts */
import type { PageTitleProps } from './scripts/page-title-types';
import { useAppContext } from '../../context/scripts/context-hooks';

export const PageTitle = (props: PageTitleProps) => {
	const { title } = props;
	const { variables } = useAppContext();
	const updatedTitle = `${variables.site.name} - ${title}`;

	// React 19 moves this into <head> and removes it on unmount, so the static title in index.html comes back when leaving the page
	// Note: this doesn't update og:title, since link preview crawlers only read the static HTML
	return <title>{updatedTitle}</title>;
};
