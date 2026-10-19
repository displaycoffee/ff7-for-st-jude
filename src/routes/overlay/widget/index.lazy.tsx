/* Packages */
import { createLazyFileRoute, useLocation } from '@tanstack/react-router';

/* Components */
import { Title } from '@/components/title/Title';
import { Widget } from '@/components/widget/Widget';

/* Page title */
const title = 'Widget';

export const Route = createLazyFileRoute('/overlay/widget/')({
	component: RouteComponent,
});

function RouteComponent() {
	// Read the raw query string, since the router would parse a numeric username as a number
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const user = new URLSearchParams(searchStr).get('user') ?? undefined;

	return (
		<>
			<Title title={title} />

			<Widget user={user} />
		</>
	);
}
