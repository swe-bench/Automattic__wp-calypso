import {
	PLAN_FREE,
	PRODUCT_1GB_SPACE,
	getPlanPath,
	isBusinessPlan,
} from '@automattic/calypso-products';
import page from '@automattic/calypso-router';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getPlanCartItem } from 'calypso/lib/cart-values/cart-items';
import { getTrialCheckoutUrl } from 'calypso/lib/trials/get-trial-checkout-url';
import PlansFeaturesMain from 'calypso/my-sites/plans-features-main';
import { useDispatch } from 'calypso/state';
import { getCurrentUserId, isCurrentUserEmailVerified } from 'calypso/state/current-user/selectors';
import { savePreference } from 'calypso/state/preferences/actions';
import type { MinimalRequestCartProduct } from '@automattic/shopping-cart';

interface BusinessTrialPlansProps {
	siteId: number | null;
	siteSlug: string;
	triggerTracksEvent?: ( planSlug: string ) => void;
}

export function BusinessTrialPlans( props: BusinessTrialPlansProps ) {
	const { siteId, siteSlug, triggerTracksEvent } = props;
	const dispatch = useDispatch();
	const userId = useSelector( getCurrentUserId );
	const isEmailVerified = useSelector( isCurrentUserEmailVerified );
	const handleSelectedTrialPlan = () => {
		console.log( 'handleSelectedTrialPlan', `selected-trial-plan-${ userId }`, isEmailVerified );
		dispatch( savePreference( `selected-trial-plan-${ userId }`, true ) );
	};

	const onUpgradeClick = useCallback(
		( cartItems?: MinimalRequestCartProduct[] | null ) => {
			if ( ! isEmailVerified ) {
				handleSelectedTrialPlan();
			}

			const upgradePlanSlug = getPlanCartItem( cartItems )?.product_slug ?? PLAN_FREE;

			triggerTracksEvent?.( upgradePlanSlug );

			const planPath = getPlanPath( upgradePlanSlug ) ?? '';

			const cartItemForStorageAddOn = cartItems?.find(
				( items ) => items.product_slug === PRODUCT_1GB_SPACE
			);

			const checkoutUrl = isBusinessPlan( upgradePlanSlug )
				? getTrialCheckoutUrl( { productSlug: planPath, siteSlug, addOn: cartItemForStorageAddOn } )
				: `/checkout/${ siteSlug }/${ planPath }`;

			page( checkoutUrl );
		},
		[ siteSlug, triggerTracksEvent, isEmailVerified, handleSelectedTrialPlan ]
	);

	return (
		<div className="business-trial-plans__grid is-2023-pricing-grid">
			<PlansFeaturesMain
				siteId={ siteId }
				onUpgradeClick={ onUpgradeClick }
				intervalType="yearly"
				hidePlanTypeSelector={ true }
				hideUnavailableFeatures={ true }
				hidePlansFeatureComparison={ true }
				intent="plans-business-trial"
			/>
		</div>
	);
}
