import { isDelayedDomainTransfer } from '@automattic/calypso-products';
import { CheckoutThankYouCombinedProps, getFailedPurchases, getPurchases } from '..';

/**
 * Determines whether the current checkout flow renders a redesigned congrats page
 * using the new component `<ThankYouV2>` instead of `<ThankYouLayout>`. The ultimate
 * goal is to refactor and migrate all thank you pages to use `<ThankYouV2>`, so that
 * consistent structure and styling are applied.
 * @returns {boolean}
 */
export const isRefactoredForThankYouV2 = ( props: CheckoutThankYouCombinedProps ) => {
	// Fallback to old design when there is a failed purchase.
	const failedPurchases = getFailedPurchases( props );
	if ( failedPurchases.length > 0 ) {
		return false;
	}

	const purchases = getPurchases( props );

	if ( ! purchases.length ) {
		return false;
	}

	if ( purchases.find( isDelayedDomainTransfer ) ) {
		return false;
	}

	return true;
};
