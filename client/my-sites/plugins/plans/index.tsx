import { FEATURE_INSTALL_PLUGINS, PLAN_BUSINESS } from '@automattic/calypso-products';
import { useTranslate } from 'i18n-calypso';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocumentHead from 'calypso/components/data/document-head';
import FixedNavigationHeader from 'calypso/components/fixed-navigation-header';
import FormattedHeader from 'calypso/components/formatted-header';
import MainComponent from 'calypso/components/main';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import PlansFeaturesMain from 'calypso/my-sites/plans-features-main';
import { appendBreadcrumb } from 'calypso/state/breadcrumb/actions';
import { getBreadcrumbs } from 'calypso/state/breadcrumb/selectors';
import { getSelectedSite } from 'calypso/state/ui/selectors';

import './style.scss';

const Plans = ( { intervalType }: { intervalType: 'yearly' | 'monthly' } ) => {
	const translate = useTranslate();
	const breadcrumbs = useSelector( getBreadcrumbs );
	const selectedSite = useSelector( getSelectedSite );

	const dispatch = useDispatch();

	useEffect( () => {
		if ( breadcrumbs.length === 0 ) {
			dispatch(
				appendBreadcrumb( {
					label: translate( 'Plugins' ),
					href: `/plugins/${ selectedSite?.slug || '' }`,
					id: 'plugins',
					helpBubble: translate(
						'Add new functionality and integrations to your site with plugins.'
					),
				} )
			);
		}

		dispatch(
			appendBreadcrumb( {
				label: translate( 'Plan Upgrade' ),
				href: `/plugins/plans/${ intervalType }/${ selectedSite?.slug || '' }`,
				id: `plugin-plans`,
			} )
		);
	}, [ dispatch, translate, selectedSite, breadcrumbs.length, intervalType ] );

	const onSelectPlan = () => {
		// show eligibility warnings
	};

	return (
		<MainComponent wideLayout>
			<PageViewTracker path="/plugins/plans/:interval/:site" title="Plugins > Plan Upgrade" />
			<DocumentHead title={ translate( 'Plugins > Plan Upgrade' ) } />
			<FixedNavigationHeader navigationItems={ breadcrumbs } />
			<FormattedHeader
				className="plugin-plans-header"
				headerText={ `Your current plan doesn't support plugins` }
				subHeaderText={ `Choose the plan that's right for you and reimagine what's possible with plugins` }
				brandFont
			/>
			<div className="plans">
				<PlansFeaturesMain
					basePlansPath="/plugins/plans"
					site={ selectedSite }
					isInMarketplace
					intervalType={ intervalType }
					onUpgradeClick={ onSelectPlan }
					flowName={ 'marketplace' }
					selectedFeature={ FEATURE_INSTALL_PLUGINS }
					selectedPlan={ PLAN_BUSINESS }
					shouldShowPlansFeatureComparison
					showFAQ={ false }
					isReskinned
				/>
			</div>
		</MainComponent>
	);
};

export default Plans;
