/* Packages */
import { Outlet } from '@tanstack/react-router';

export const Content = () => {
	return (
		<div className="content">
			<Outlet />
		</div>
	);
};
