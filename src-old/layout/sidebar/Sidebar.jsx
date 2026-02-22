/* Local styles */
import './styles/sidebar.scss';

export const Sidebar = (props) => {
	const show = props.show;

	return show ? (
		<aside className="sidebar">
			<p>this is sidebar content.</p>
		</aside>
	) : null;
};
