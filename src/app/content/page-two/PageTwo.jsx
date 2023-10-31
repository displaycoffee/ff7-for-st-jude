/* Local styles */
import './styles/page-two.scss';

export const PageTwo = () => {
	return (
		<div className="page-two spacing-reset">
			<p>this is the second page.</p>

			<div className="row row-20 row-nowrap">
				<div className="column">column 01</div>

				<div className="column">column 02</div>

				<div className="column">column 03</div>
			</div>

			<p>an element below the row example.</p>
		</div>
	);
};
