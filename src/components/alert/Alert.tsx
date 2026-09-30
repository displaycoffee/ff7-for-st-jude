/* Styles */
import './styles/alert.scss';

/* Packages */
import IconCircleAlert from '~icons/lucide/circle-alert';
import IconCircleCheck from '~icons/lucide/circle-check';
import IconCircleX from '~icons/lucide/circle-x';
import IconInfo from '~icons/lucide/info';

/* Scripts */
import type { AlertIconType, AlertProps } from './scripts/alert-types';

/* Set icon component */
const alertIcons: AlertIconType = {
	error: <IconCircleX />,
	info: <IconInfo />,
	success: <IconCircleCheck />,
	warning: <IconCircleAlert />,
};

export const Alert = (props: AlertProps) => {
	const { children, className: propClassName, type = 'error', ...rest } = props;
	const classes = `alert alert-${type} flex-nowrap`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const role = type == 'info' || type == 'success' ? 'status' : 'alert';

	return (
		<div className={className} role={role} {...rest}>
			<div className="alert-icon">{alertIcons[type]}</div>
			<div className="alert-message margin-trim">{children}</div>
		</div>
	);
};
