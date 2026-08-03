/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';
import { DonationsSectionProps } from './scripts/donations-section-types';

/* Components */
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Skeleton } from '../../components/skeleton/Skeleton';

export const DonationsSection = (props: DonationsSectionProps) => {
	const { donations, donationsComplete } = props;
	const { utils } = useAppContext();

	return (
		<ErrorBoundary message="Something went wrong loading donations.">
			<Details header={'Donations'} hasRow={true} scrollLink={true}>
				<p className="sr-only" role="status">
					{!donationsComplete ? 'Loading donations...' : utils.checkArray(donations.values) ? 'Donations loaded.' : ''}
				</p>

				<div className="row row-auto row-spacing-20 row-wrap">
					{donations.fetched && utils.checkArray(donations.values)
						? donations.values.map((donation) => {
								const { amount } = donation.amounts;

								return (
									<div className="column column-width-33" key={donation.key}>
										<div className="gradient-section">
											<p>
												<strong>Donation:</strong> {utils.formatCurrency(amount)} from <strong>{donation.from}</strong> to{' '}
												<DetailsLinks links={donation.links} wrapper={false} />
											</p>

											<DetailsParagraph label={'Comment'} content={donation.comment} />
										</div>
									</div>
								);
							})
						: null}

					{!donationsComplete ? (
						<Skeleton columns={15} perRow={3} paragraphs={2} />
					) : donations.values.length === 0 ? (
						<DetailsNotFound type={'donations'} />
					) : null}
				</div>
			</Details>
		</ErrorBoundary>
	);
};
