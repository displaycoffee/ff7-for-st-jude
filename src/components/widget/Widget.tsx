/* Styles */
import './styles/widget.scss';

/* Packages */
import { useQuery } from '@tanstack/react-query';

/* Scripts */
import type { WidgetProps } from './scripts/widget-types';
import { useEventStream } from '@/_core/scripts/live';
import { requests } from '@/_core/scripts/requests';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { LevelBar } from '@/components/level-bar/LevelBar';

export const Widget = (props: WidgetProps) => {
	const { logo = true, user } = props;
	const { campaigns, utils, variables } = useAppContext();
	const { current } = campaigns;

	// Participants can show their own campaign by Tiltify username, otherwise show the team campaign
	const { data: supportingData, isSuccess: supportingSuccess } = useQuery({
		queryKey: ['supporting', current],
		queryFn: requests.supporting,
		enabled: !!user,
	});
	const support = user ? supportingData?.find((item) => item.username.toLowerCase() == user.toLowerCase()) : undefined;
	const notFound = !!user && supportingSuccess && !support;

	// Get campaign totals and latest donation
	const { data: widget, refetch } = useQuery({
		queryKey: ['widget', current, support ?? null],
		queryFn: requests.widget,
		enabled: !user || !!support,
	});

	// Refetch whenever Tiltify reports an update, keeping the current values on screen meanwhile
	useEventStream(() => void refetch(), !notFound);

	if (notFound) {
		return (
			<div className="widget gradient-section">
				<p>Couldn't find a campaign for "{user}".</p>
			</div>
		);
	}

	const raised = widget?.amounts.total_amount_raised ?? 0;
	const goal = widget?.amounts.goal ?? 0;
	const percent = goal ? Math.floor((raised / goal) * 100) : 0;
	const latest = widget?.latest;

	return (
		<div className="widget gradient-section flex-nowrap flex-align-items-center">
			{logo ? (
				<div className="widget-column widget-logo">
					<img src="/assets/images/logos/ff7-for-st-jude-transparent.png" alt="FF7 for St. Jude - Logo" width="396" height="257" />
				</div>
			) : null}

			<div className="widget-column widget-campaign">
				<p className="widget-title widget-bold">{variables.site.name}</p>
				<p className="widget-name">{support ? support.username : 'Team Total'}</p>
			</div>

			<div className="widget-column widget-level-bar">
				<LevelBar raised={raised} goal={goal} label={`${utils.formatCurrency(raised)} out of ${utils.formatCurrency(goal)} (${percent}%)`} />
			</div>

			{/* Keyed by donation so the highlight animation replays for each new donation */}
			<div className="widget-column widget-latest" key={latest?.id ?? 'none'}>
				<p className="widget-latest-donation widget-bold">Latest donation</p>
				<p className="widget-latest-amount">
					{latest ? (
						<>
							{latest.from} - {utils.formatCurrency(latest.amounts.amount)}
						</>
					) : (
						'None yet'
					)}
				</p>
				{latest?.comment ? <p className="widget-latest-comment">{latest.comment}</p> : null}
			</div>
		</div>
	);
};
