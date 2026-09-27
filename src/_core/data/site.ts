/* Scripts */
import packageJson from '../../../package.json' with { type: 'json' };

export const site: SiteType = {
	name: packageJson.displayName || '',
	description: packageJson.description || '',
	url: packageJson.homepage || 'https://localhost:3000',
};
