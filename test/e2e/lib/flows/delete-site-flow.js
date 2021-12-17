import * as dataHelper from '../data-helper.js';
import SettingsPage from '../pages/settings-page.js';
import * as SlackNotifier from '../slack-notifier.js';

export default class DeleteSiteFlow {
	constructor( driver ) {
		this.driver = driver;
	}

	async deleteSite( siteDomain ) {
		await this.driver.sleep( 2000 ); // wait before open site settings page

		return ( async () => {
			await this.driver.get( dataHelper.getCalypsoURL( `settings/general/${ siteDomain }` ) );
			const settingsPage = await SettingsPage.Expect( this.driver );
			return await settingsPage.deleteSite( siteDomain );
		} )().catch( ( err ) => {
			SlackNotifier.warn(
				`There was an error in the hooks that delete test sites, but since it is cleaning up we really don't care: '${ err }'`,
				{ suppressDuplicateMessages: true }
			);
		} );
	}
}
