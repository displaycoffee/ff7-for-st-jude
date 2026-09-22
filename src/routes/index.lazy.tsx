/* Styles */
import './index/styles/index.scss';

/* Packages */
import { createLazyFileRoute } from '@tanstack/react-router';

/* Components */
import { List } from '../components/blocks/Blocks';
import { Dropdown } from '../components/dropdown/Dropdown';

export const Route = createLazyFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="home margin-trim">
			<h2>Home</h2>

			<p>This is an index page.</p>

			<Dropdown buttonLabel={'Label'}>
				<List>
					<li>Item 1</li>
					<li>Item 2</li>
					<li>Item 3</li>
					<li>Item 4</li>
				</List>
			</Dropdown>

			<List>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</List>

			<List variant={'ol'}>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</List>
		</div>
	);
}
