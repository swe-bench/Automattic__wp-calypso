import { By } from 'selenium-webdriver';
import AsyncBaseContainer from '../async-base-container.js';
import * as driverHelper from '../driver-helper.js';

export default class RevisionsModalComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.editor-revisions' ) );
	}

	async _preInit() {
		return await this.driver.switchTo().defaultContent();
	}

	async loadFirstRevision() {
		const firstRevision = await this.driver.findElement(
			By.css( '.editor-revisions-list__revision:last-child .editor-revisions-list__button' )
		);
		const loadButton = await this.driver.findElement( By.css( '[data-e2e-button="load"]' ) );

		// Using a JS clicks here since Webdriver clicks weren't working.
		await this.driver.executeScript( 'arguments[0].click()', firstRevision );
		await this.driver.executeScript( 'arguments[0].click()', loadButton );

		return await driverHelper.waitUntilElementNotLocated(
			this.driver,
			this.expectedElementLocator
		);
	}
}
