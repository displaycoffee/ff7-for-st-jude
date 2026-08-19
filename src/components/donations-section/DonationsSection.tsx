/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';
import { DonationsSectionProps } from './scripts/donations-section-types';

/* Components */
import { Section, SectionParagraph, SectionLinks, SectionNotFound, Skeleton } from '../../components/blocks/Blocks';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';

export const DonationsSection = (props: DonationsSectionProps) => {
	const { donations, donationsComplete } = props;
	const { utils } = useAppContext();

	return (
		<ErrorBoundary message="Something went wrong loading donations.">
			<Section title={'Donations'} hasRow={true}>
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
												<SectionLinks links={donation.links} wrapper={false} />
											</p>

											<SectionParagraph label={'Comment'} content={donation.comment} />
										</div>
									</div>
								);
							})
						: null}

					{!donationsComplete ? (
						<Skeleton columns={15} perRow={3} paragraphs={2} />
					) : donations.values.length === 0 ? (
						<SectionNotFound type={'donations'} />
					) : null}
				</div>
			</Section>
		</ErrorBoundary>
	);
};
