import { By } from 'selenium-webdriver';
import AsyncBaseContainer from '../../async-base-container.js';
import * as driverHelper from '../../driver-helper.js';

export default class JetpackComPricingPage extends AsyncBaseContainer {
	constructor( driver, url ) {
		if ( ! url ) {
			url = 'https://cloud.jetpack.com/pricing/';
		}
		super( driver, By.css( '.is-section-jetpack-cloud-pricing .selector__main' ), url );
	}

	async buyJetpackPlan( planSlug ) {
		const planCTA = By.css( `[data-e2e-product-slug="${ planSlug }"] .button` );
		return await driverHelper.clickWhenClickable( this.driver, planCTA );
	}
}
