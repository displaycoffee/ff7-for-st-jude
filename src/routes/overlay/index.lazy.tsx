/* Styles */
import './styles/overlay.scss';

/* Packages */
import { createLazyFileRoute, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

/* Scripts */
import { requests } from '@/_core/scripts/requests';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { Title } from '@/components/title/Title';
import { Widget } from '@/components/widget/Widget';

/* Page title */
const title = 'Overlay';

/* Static variables */
const streamCount = 6;

export const Route = createLazyFileRoute('/overlay/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaigns } = useAppContext();
	const { current } = campaigns;

	// Read the raw query string, since the router would parse a numeric username as a number
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const search = new URLSearchParams(searchStr);
	const user = search.get('user') ?? undefined;
	const streamsParam = search.get('streams');

	// Supporting campaigns are kept in the order Tiltify returns them, so streams don't jump around as totals change
	const { data: supportingData } = useQuery({ queryKey: ['supporting', current], queryFn: requests.supporting });
	const supporting = supportingData ?? [];

	// Use ?streams=channel1,channel2 if it's set, otherwise every supporting campaign with a Twitch channel
	const channels = streamsParam
		? streamsParam
				.split(',')
				.map((channel) => channel.trim())
				.filter(Boolean)
		: supporting.flatMap((support) => (support.channel ? [support.channel] : []));

	// Label each stream with its Tiltify username when the channel belongs to a supporting campaign
	const streams = channels.slice(0, streamCount).map((channel) => ({
		channel: channel,
		label: supporting.find((support) => support.channel?.toLowerCase() == channel.toLowerCase())?.username ?? channel,
	}));

	// Twitch only plays embeds on the domains listed in parent
	const parent = window.location.hostname;

	return (
		<>
			<Title title={title} />

			<div className="overlay-stage">
				<div className="overlay-streams">
					{Array.from({ length: streamCount }, (_, index) => streams[index]).map((stream, index) => (
						<figure className="overlay-stream" key={stream ? stream.channel : `empty-${index}`}>
							<div className="overlay-stream-frame gradient-background">
								{stream ? (
									<iframe
										src={`https://player.twitch.tv/?channel=${encodeURIComponent(stream.channel)}&parent=${parent}&muted=true`}
										title={`${stream.label} on Twitch`}
										allowFullScreen
									></iframe>
								) : null}
							</div>

							<figcaption className="overlay-stream-label">{stream?.label}</figcaption>
						</figure>
					))}
				</div>

				<Widget user={user} />
			</div>
		</>
	);
}
