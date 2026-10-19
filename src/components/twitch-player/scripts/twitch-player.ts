/* Scripts */
import type { TwitchEmbedType, TwitchQualityType } from './twitch-player-types';

/* Static variables */
const embedScript = 'https://player.twitch.tv/js/embed/v1.js';

// Shared so every player waits on the same script tag
let loading: Promise<TwitchEmbedType> | undefined;

export const loadTwitch = () => {
	loading ??= new Promise<TwitchEmbedType>((resolve, reject) => {
		const script = document.createElement('script');
		script.src = embedScript;
		script.onload = () => (window.Twitch ? resolve(window.Twitch) : reject(new Error('Twitch embed script loaded without Twitch')));
		script.onerror = () => {
			// Let the next player try again
			loading = undefined;
			script.remove();
			reject(new Error('Twitch embed script failed to load'));
		};
		document.head.appendChild(script);
	});

	return loading;
};

// Highest quality at or under maxHeight (groups look like "720p60" or "chunked" for source)
export const pickQuality = (qualities: TwitchQualityType[], maxHeight: number) => {
	const heights = qualities
		.map((quality) => ({ group: quality.group, height: quality.height || parseInt(quality.group, 10) }))
		.filter((quality) => quality.height && quality.height <= maxHeight)
		.sort((a, b) => b.height - a.height);

	return heights[0]?.group;
};
