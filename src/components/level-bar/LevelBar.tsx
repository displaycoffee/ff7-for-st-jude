/* Styles */
import './styles/level-bar.scss';

/* Scripts */
import type { LevelBarProps } from './scripts/level-bar-types';

export const LevelBar = (props: LevelBarProps) => {
	const { className, goal, label, raised } = props;

	// Fill up to the goal, campaigns that pass it just show a full bar
	const progress = raised && goal ? Math.min((raised / goal) * 100, 100) : 0;

	return (
		<div className={`level-bar${className ? ` ${className}` : ''}`}>
			<div className="level-bar-label">{label}</div>

			<div className="level-bar-outof">
				<div className="level-bar-progress" style={{ width: `${progress}%` }}></div>

				<div className="level-bar-shadow"></div>
			</div>
		</div>
	);
};
