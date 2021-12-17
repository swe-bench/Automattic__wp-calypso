import { By } from 'selenium-webdriver';
import AsyncBaseContainer from '../async-base-container.js';
import * as driverHelper from '../driver-helper.js';
import * as slackNotifier from '../slack-notifier.js';

const searchInputLocator = By.className( 'search-component__input' );

export default class FindADomainComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.register-domain-step' ) );
		this.emailUpsellLocator = By.className(
			'email-providers-comparison__titan-mailbox-action-skip'
		);
	}

	async waitForResults() {
		const driver = this.driver;
		const resultsLoadingLocator = By.css( '.domain-suggestion.is-placeholder' );
		return await driverHelper.waitUntilElementNotLocated(
			driver,
			resultsLoadingLocator,
			this.explicitWaitMS * 2
		);
	}

	async getSearchInputValue() {
		return await this.driver.findElement( searchInputLocator ).getAttribute( 'value' );
	}

	async searchForBlogNameAndWaitForResults( blogName ) {
		await driverHelper.setWhenSettable( this.driver, searchInputLocator, blogName );
		return await this.waitForResults();
	}

	async checkAndRetryForFreeBlogAddresses( expectedBlogAddresses, blogName ) {
		const self = this;
		const actualAddress = await self.freeBlogAddress();
		if ( expectedBlogAddresses.indexOf( actualAddress ) < 0 ) {
			const message = `The displayed free blog address: '${ actualAddress }' was not in the expected addresses: '${ expectedBlogAddresses }'. Re-searching for '${ blogName }' now.`;
			slackNotifier.warn( message );
			await self.searchForBlogNameAndWaitForResults( blogName );
		}
	}

	async freeBlogAddress() {
		const freeBlogAddressLocator = By.css(
			'.domain-search-results__domain-suggestions > .domain-suggestion .domain-registration-suggestion__title'
		);
		return await this.driver.findElement( freeBlogAddressLocator ).getText();
	}

	async selectDomainAddress( domainAddress ) {
		const locator = By.css( `[data-e2e-domain="${ domainAddress }"]` );
		return await driverHelper.clickWhenClickable( this.driver, locator );
	}

	async selectFreeAddress() {
		const freeAddressLocator = By.css(
			'.domain-search-results__domain-suggestions > .domain-suggestion.is-clickable'
		);
		return await driverHelper.clickWhenClickable(
			this.driver,
			freeAddressLocator,
			this.explicitWaitMS
		);
	}

	async selectUseOwnDomain() {
		const useOwnDomain = By.css( '.already-own-a-domain > span > a' );
		await driverHelper.scrollIntoView( this.driver, useOwnDomain );
		return await driverHelper.clickWhenClickable( this.driver, useOwnDomain, this.explicitWaitMS );
	}

	async skipSuggestion() {
		// currently used in 'launch-site' signup flow
		const skipSuggestion = By.css(
			'.domain-skip-suggestion > div > .button.domain-suggestion__action'
		);
		await driverHelper.scrollIntoView( this.driver, skipSuggestion );
		return await driverHelper.clickWhenClickable(
			this.driver,
			skipSuggestion,
			this.explicitWaitMS
		);
	}

	async declineEmailUpsell() {
		await driverHelper.clickWhenClickable(
			this.driver,
			this.emailUpsellLocator,
			this.explicitWaitMS
		);
		try {
			await driverHelper.waitUntilElementNotLocated( this.driver, this.emailUpsellLocator );
		} catch ( err ) {
			//Sometimes the first click doesn't work. Clicking again
			await driverHelper.clickWhenClickable( this.driver, this.emailUpsellLocator );
		}
	}

	async selectPreviousStep() {
		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( 'a.previous-step' ),
			this.explicitWaitMS
		);
	}
}
