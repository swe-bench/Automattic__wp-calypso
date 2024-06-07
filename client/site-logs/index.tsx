import page, { type Callback } from '@automattic/calypso-router';
import {
	makeLayout,
	render as clientRender,
	redirectToHostingPromoIfNotAtomic,
} from 'calypso/controller';
import { siteSelection, sites, navigation } from 'calypso/my-sites/controller';
import { redirectHomeIfIneligible } from 'calypso/my-sites/site-monitoring/controller';
import { siteDashboard } from 'calypso/sites-dashboard-v2/controller';
import { DOTCOM_LOGS } from 'calypso/sites-dashboard-v2/site-preview-pane/constants';
import { httpRequestLogs, phpErrorLogs } from './controller';

export default function () {
	page( '/site-logs', siteSelection, sites, makeLayout, clientRender );

	const redirectSiteLogsToPhp: Callback = ( context ) => {
		context.page.replace( `/site-logs/${ context.params.site }/php` );
	};
	page( '/site-logs/:site', redirectSiteLogsToPhp );

	page(
		'/site-logs/:site/php',
		siteSelection,
		redirectToHostingPromoIfNotAtomic,
		redirectHomeIfIneligible,
		navigation,
		phpErrorLogs,
		siteDashboard( DOTCOM_LOGS ),
		makeLayout,
		clientRender
	);
	page(
		'/site-logs/:site/web',
		siteSelection,
		redirectToHostingPromoIfNotAtomic,
		redirectHomeIfIneligible,
		navigation,
		httpRequestLogs,
		siteDashboard( DOTCOM_LOGS ),
		makeLayout,
		clientRender
	);
}
