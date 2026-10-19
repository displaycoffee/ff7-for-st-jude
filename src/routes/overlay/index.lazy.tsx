/* Styles */
import './styles/overlay.scss';

/* Packages */
import { createLazyFileRoute, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/* Scripts */
import { requests } from '@/_core/scripts/requests';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { Title } from '@/components/title/Title';
import { TwitchPlayer } from '@/components/twitch-player/TwitchPlayer';
import { Widget } from '@/components/widget/Widget';

/* Page title */
const title = 'Overlay';

/* Static variables */
const options = {
	count: 6,
	quality: 480, // max video height, the tiles are only about 330px tall
	gap: 1000, // wait after a player is ready before starting the next
	fallback: 8000, // start the next player anyway if one never reports ready
	allowAny: import.meta.env.DEV, // let ?streams= show channels outside the campaign, for testing
};

export const Route = createLazyFileRoute('/overlay/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaigns, utils } = useAppContext();
	const { current } = campaigns;

	// Read the raw query string, since the router would parse a numeric username as a number
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const searchParams = new URLSearchParams(searchStr);
	const logo = searchParams.get('logo') ? searchParams.get('logo') != 'false' : true;
	const user = searchParams.get('user') ?? undefined;
	const streamsParam = searchParams.get('streams');
	const sortParam = searchParams.get('sort');

	// Supporting campaigns are kept in the order Tiltify returns them by default
	const { data: supportingData } = useQuery({ queryKey: ['supporting', current], queryFn: requests.supporting });
	const supporting = supportingData ?? [];

	// ?sort=most or ?sort=least ranks the default streams by amount raised
	// Note: supporting isn't refetched on the overlay, so the order is set on load and players don't move around mid-stream
	const ranked =
		sortParam == 'most' || sortParam == 'least'
			? utils.sort(supporting, (support) => support.amounts.total_amount_raised, sortParam == 'most' ? 'desc' : 'asc')
			: supporting;

	// Show ?streams=channel1,channel2 first, then fill the rest with every supporting campaign that has a Twitch channel
	const listed = (streamsParam ?? '')
		.split(',')
		.map((channel) => channel.trim())
		.filter(Boolean);
	// ?fill=false shows only the listed streams (ignored without ?streams=, so the overlay is never empty)
	const fill = searchParams.get('fill') != 'false' || listed.length == 0;
	const channels = [...listed, ...(fill ? ranked.flatMap((support) => (support.channel ? [support.channel] : [])) : [])];

	// Only show channels connected to a supporting campaign (unless testing), labeled with the Tiltify username
	const streams = channels
		.map((channel) => ({
			channel: channel,
			support: supporting.find((support) => support.channel?.toLowerCase() == channel.toLowerCase()),
		}))
		.filter((stream) => stream.support || options.allowAny)
		.filter((stream, index, list) => list.findIndex((item) => item.channel.toLowerCase() == stream.channel.toLowerCase()) == index)
		.slice(0, options.count)
		.map((stream) => ({ channel: stream.channel, label: stream.support?.username ?? stream.channel }));

	// Start the players one at a time, so Twitch isn't hit with six at once
	const [started, setStarted] = useState(1);
	const [ready, setReady] = useState(0);

	useEffect(() => {
		if (started >= options.count) {
			return;
		}

		const timer = window.setTimeout(() => setStarted(started + 1), ready >= started ? options.gap : options.fallback);
		return () => window.clearTimeout(timer);
	}, [ready, started]);

	return (
		<>
			<Title title={title} />

			<div className="overlay-stage">
				<div className="overlay-streams">
					{Array.from({ length: options.count }, (_, index) => streams[index]).map((stream, index) => (
						<figure className="overlay-stream" key={stream ? stream.channel : `empty-${index}`}>
							<div className="overlay-stream-frame gradient-background">
								{stream && index < started ? (
									<TwitchPlayer
										channel={stream.channel}
										maxHeight={options.quality}
										title={`${stream.label} on Twitch`}
										onReady={() => setReady((count) => Math.max(count, index + 1))}
									/>
								) : null}
							</div>

							<figcaption className="overlay-stream-label">{stream?.label}</figcaption>
						</figure>
					))}
				</div>

				<Widget logo={logo} user={user} />
			</div>
		</>
	);
}
