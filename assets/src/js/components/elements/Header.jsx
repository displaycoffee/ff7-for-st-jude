export const Header = (props) => {
	const { buttonClick } = props;

	// make button spin
	const addSpin = () => {
		const button = document.querySelector('.header-button');
		const spin = 'spinning';
		const spinComplete = 'spinning-complete';

		setTimeout(() => {
			button.classList.add(spin);
			setTimeout(() => {
				button.classList.remove(spin);
				button.classList.add(spinComplete);
				setTimeout(() => {
					button.classList.remove(spinComplete);
				}, 2500);
			}, 1500);
		});
	};

	return (
		<>
			<header className="header flex-wrap flex-align-center">
				<h1 className="header-title">FF7 for St. Jude</h1>

				<button
					className="header-button pointer"
					type="button"
					onClick={(e) => {
						e.preventDefault();
						addSpin();
						buttonClick();
					}}
				>
					<span className="header-button-label-01">I'll try spinning.</span>
					<span className="header-button-label-02">That's a good trick.</span>
				</button>
			</header>
		</>
	);
};
