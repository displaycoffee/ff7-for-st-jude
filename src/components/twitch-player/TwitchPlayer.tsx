/* Styles */
import './styles/twitch-player.scss';

/* Packages */
import { useEffect, useRef } from 'react';

/* Scripts */
import type { TwitchPlayerProps } from './scripts/twitch-player-types';
import { loadTwitch, pickQuality } from './scripts/twitch-player';

export const TwitchPlayer = (props: TwitchPlayerProps) => {
	const { channel, maxHeight, onReady, title } = props;
	const playerRef = useRef<HTMLDivElement>(null);

	// Keep the latest callback without recreating the player
	const onReadyRef = useRef(onReady);
	useEffect(() => {
		onReadyRef.current = onReady;
	}, [onReady]);

	useEffect(() => {
		const element = playerRef.current;
		let cancelled = false;

		loadTwitch()
			.then((Twitch) => {
				if (cancelled || !element) {
					return;
				}

				// Twitch only plays embeds on the domains listed in parent
				const player = new Twitch.Player(element, {
					autoplay: true,
					channel: channel,
					height: '100%',
					muted: true,
					parent: [window.location.hostname],
					width: '100%',
				});

				element.querySelector('iframe')?.setAttribute('title', title);

				player.addEventListener(Twitch.Player.READY, () => onReadyRef.current?.());

				// Quality goes back to auto when a stream restarts, so check it every time playback starts
				if (maxHeight) {
					player.addEventListener(Twitch.Player.PLAYING, () => {
						const quality = pickQuality(player.getQualities(), maxHeight);
						if (quality && quality != player.getQuality()) {
							player.setQuality(quality);
						}
					});
				}
			})
			.catch((error: unknown) => {
				console.error(error);
				// Don't hold up the players after this one
				onReadyRef.current?.();
			});

		return () => {
			cancelled = true;
			element?.replaceChildren();
		};
	}, [channel, maxHeight, title]);

	return <div className="twitch-player" ref={playerRef}></div>;
};
