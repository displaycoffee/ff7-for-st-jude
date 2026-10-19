/* Type definitions */
type TwitchPlayer = {
	channel: string;
	maxHeight?: number;
	onReady?: () => void;
	title: string;
};

type TwitchQuality = {
	group: string;
	height?: number;
};

type TwitchPlayerOptions = {
	autoplay: boolean;
	channel: string;
	height: string;
	muted: boolean;
	parent: string[];
	width: string;
};

type TwitchPlayerInstance = {
	addEventListener: (event: string, callback: () => void) => void;
	getQualities: () => TwitchQuality[];
	getQuality: () => string;
	setQuality: (group: string) => void;
};

type TwitchEmbed = {
	Player: {
		new (element: HTMLElement, options: TwitchPlayerOptions): TwitchPlayerInstance;
		PLAYING: string;
		READY: string;
	};
};

/* Twitch's embed script adds itself to window */
declare global {
	interface Window {
		Twitch?: TwitchEmbed;
	}
}

/* Export prop types */
export type TwitchPlayerProps = TwitchPlayer;
export type TwitchQualityType = TwitchQuality;
export type TwitchEmbedType = TwitchEmbed;
