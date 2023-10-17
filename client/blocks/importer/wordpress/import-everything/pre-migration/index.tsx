import { SiteDetails } from '@automattic/data-stores';
import { NextButton, Title } from '@automattic/onboarding';
import { useTranslate } from 'i18n-calypso';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSiteMigrateInfo } from 'calypso/blocks/importer/hooks/use-site-can-migrate';
import { useSiteCredentialsInfo } from 'calypso/blocks/importer/hooks/use-site-credentials-info';
import { formatSlugToURL } from 'calypso/blocks/importer/util';
import { UpdatePluginInfo } from 'calypso/blocks/importer/wordpress/import-everything/pre-migration/update-plugins';
import { PreMigrationUpgradePlan } from 'calypso/blocks/importer/wordpress/import-everything/pre-migration/upgrade-plan';
import QuerySites from 'calypso/components/data/query-sites';
import { LoadingEllipsis } from 'calypso/components/loading-ellipsis';
import useAddHostingTrialMutation from 'calypso/data/hosting/use-add-hosting-trial-mutation';
import useMigrationConfirmation from 'calypso/landing/stepper/hooks/use-migration-confirmation';
import { useQuery } from 'calypso/landing/stepper/hooks/use-query';
import { Interval, EVERY_FIVE_SECONDS } from 'calypso/lib/interval';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getCredentials } from 'calypso/state/jetpack/credentials/actions';
import { isRequestingSitePlans } from 'calypso/state/sites/plans/selectors';
import NotAuthorized from '../../../components/not-authorized';
import ConfirmModal from './confirm-modal';
import { Credentials } from './credentials';
import { CredentialsCta } from './credentials-cta';
import { StartImportTrackingProps } from './types';

import './style.scss';

interface PreMigrationProps {
	sourceSite?: SiteDetails;
	targetSite: SiteDetails;
	initImportRun?: boolean;
	isTrial?: boolean;
	isMigrateFromWp: boolean;
	isTargetSitePlanCompatible: boolean;
	startImport: ( props?: StartImportTrackingProps ) => void;
	onFreeTrialClick: () => void;
	onContentOnlyClick: () => void;
	onNotAuthorizedClick: () => void;
}

export const PreMigrationScreen: React.FunctionComponent< PreMigrationProps > = (
	props: PreMigrationProps
) => {
	const {
		sourceSite,
		targetSite,
		initImportRun,
		isTargetSitePlanCompatible,
		isMigrateFromWp,
		isTrial,
		startImport,
		onFreeTrialClick,
		onContentOnlyClick,
		onNotAuthorizedClick,
	} = props;

	const translate = useTranslate();
	const dispatch = useDispatch();
	const urlQueryParams = useQuery();
	const sourceSiteSlug = urlQueryParams.get( 'from' ) ?? '';
	const sourceSiteUrl = formatSlugToURL( sourceSiteSlug );

	const [ showCredentials, setShowCredentials ] = useState( false );
	const [ showConfirmModal, setShowConfirmModal ] = useState( false );
	const [ migrationConfirmed, setMigrationConfirmed ] = useMigrationConfirmation();
	const [ hasLoaded, setHasLoaded ] = useState( false );
	const [ continueImport, setContinueImport ] = useState( false );

	const {
		sourceSiteId,
		fetchMigrationEnabledStatus,
		isFetchingData: isFetchingMigrationData,
		siteCanMigrate,
	} = useSiteMigrateInfo( targetSite.ID, sourceSiteSlug, isTargetSitePlanCompatible );

	const requiresPluginUpdate = siteCanMigrate === false;

	const migrationTrackingProps = {
		source_site_id: sourceSiteId,
		source_site_url: sourceSiteUrl,
		target_site_id: targetSite.ID,
		target_site_slug: targetSite.slug,
		is_migrate_from_wp: isMigrateFromWp,
		is_trial: isTrial,
	};

	const toggleCredentialsForm = () => {
		setShowCredentials( ! showCredentials );
		dispatch(
			recordTracksEvent( 'calypso_site_migration_credentials_form_toggle', migrationTrackingProps )
		);
	};

	const [ queryTargetSitePlanStatus, setQueryTargetSitePlanStatus ] = useState<
		'init' | 'fetching' | 'fetched'
	>( 'init' );

	const isRequestingTargetSitePlans = useSelector( ( state ) =>
		isRequestingSitePlans( state, targetSite.ID )
	);

	useEffect( () => {
		if ( queryTargetSitePlanStatus === 'fetching' && ! isRequestingTargetSitePlans ) {
			setQueryTargetSitePlanStatus( 'fetched' );
			setContinueImport( true );
			fetchMigrationEnabledStatus();
		}
	}, [ queryTargetSitePlanStatus, isRequestingTargetSitePlans, fetchMigrationEnabledStatus ] );

	const { isLoading: isAddingTrial } = useAddHostingTrialMutation( {
		onSuccess: () => {
			setQueryTargetSitePlanStatus( 'fetching' );
		},
	} );

	const { hasCredentials, isRequesting: isRequestingCredentials } =
		useSiteCredentialsInfo( sourceSiteId );

	const onUpgradeAndMigrateClick = () => {
		setContinueImport( true );
		fetchMigrationEnabledStatus();
	};

	function displayConfirmModal() {
		dispatch(
			recordTracksEvent( 'calypso_site_migration_confirm_modal_display', migrationTrackingProps )
		);
		setShowConfirmModal( true );
	}

	function hideConfirmModal() {
		dispatch(
			recordTracksEvent( 'calypso_site_migration_confirm_modal_hide', migrationTrackingProps )
		);
		setShowConfirmModal( false );
	}

	// We want to record the tracks event, so we use the same condition as the one in the render function
	// This should be better handled by using a state after the refactor
	useEffect( () => {
		if ( ! requiresPluginUpdate && isTargetSitePlanCompatible ) {
			const _migrationTrackingProps: { [ key: string ]: unknown } = { ...migrationTrackingProps };
			// There is a case where source_site_id is 0|undefined, so we need to delete it
			delete _migrationTrackingProps?.source_site_id;

			dispatch(
				recordTracksEvent( 'calypso_site_migration_ready_screen', _migrationTrackingProps )
			);
		}
	}, [ requiresPluginUpdate, isTargetSitePlanCompatible ] );

	// Initiate the migration if initImportRun is set
	useEffect( () => {
		initImportRun && startImport( { type: 'without-credentials', ...migrationTrackingProps } );
	}, [] );

	useEffect( () => {
		if ( isTargetSitePlanCompatible && sourceSiteId ) {
			dispatch( getCredentials( sourceSiteId ) );
			setHasLoaded( true );
		}
	}, [ isTargetSitePlanCompatible, sourceSiteId, dispatch ] );

	useEffect( () => {
		// If we are blocked by plugin upgrade check or has continueImport set to false, we do not start the migration
		if ( requiresPluginUpdate || ! continueImport ) {
			return;
		}
		if ( sourceSiteId ) {
			startImport( migrationTrackingProps );
		}
	}, [ continueImport, sourceSiteId, startImport, requiresPluginUpdate ] );

	function renderPreMigration() {
		// Show a loading state when we are trying to fetch existing credentials
		if ( ! hasLoaded || isRequestingCredentials ) {
			return <LoadingEllipsis />;
		}

		if ( ! sourceSite || ( sourceSite && sourceSite.ID !== sourceSiteId ) ) {
			return (
				<NotAuthorized
					onStartBuilding={ onNotAuthorizedClick }
					onStartBuildingText={ translate( 'Skip to dashboard' ) }
				/>
			);
		}

		return (
			<>
				{ showConfirmModal && (
					<ConfirmModal
						sourceSiteSlug={ sourceSiteSlug }
						targetSiteSlug={ targetSite.slug }
						onClose={ hideConfirmModal }
						onConfirm={ () => {
							// reset migration confirmation to initial state
							setMigrationConfirmed( false );
							startImport( { type: 'without-credentials', ...migrationTrackingProps } );
						} }
					/>
				) }
				<div className="import__pre-migration import__import-everything import__import-everything--redesign">
					<div className="import__heading-title">
						<Title>{ translate( 'You are ready to migrate' ) }</Title>
					</div>
					{ ! hasCredentials && <CredentialsCta onButtonClick={ toggleCredentialsForm } /> }
					{ ! showCredentials && (
						<div className="import__footer-button-container pre-migration__proceed">
							<NextButton
								type="button"
								onClick={ () => {
									migrationConfirmed
										? startImport( { type: 'without-credentials', ...migrationTrackingProps } )
										: displayConfirmModal();
								} }
							>
								{ translate( 'Start migration' ) }
							</NextButton>
						</div>
					) }
				</div>
			</>
		);
	}

	function renderUpdatePluginInfo() {
		return (
			<>
				<UpdatePluginInfo
					isMigrateFromWp={ isMigrateFromWp }
					sourceSiteUrl={ sourceSiteUrl }
					migrationTrackingProps={ migrationTrackingProps }
				/>
				<Interval onTick={ fetchMigrationEnabledStatus } period={ EVERY_FIVE_SECONDS } />
			</>
		);
	}

	function renderUpgradePlan() {
		return (
			<>
				{ queryTargetSitePlanStatus === 'fetching' && <QuerySites siteId={ targetSite.ID } /> }
				<PreMigrationUpgradePlan
					sourceSiteSlug={ sourceSiteSlug }
					sourceSiteUrl={ sourceSiteUrl }
					targetSite={ targetSite }
					startImport={ onUpgradeAndMigrateClick }
					onFreeTrialClick={ onFreeTrialClick }
					onContentOnlyClick={ onContentOnlyClick }
					isBusy={
						isFetchingMigrationData || isAddingTrial || queryTargetSitePlanStatus === 'fetched'
					}
					migrationTrackingProps={ migrationTrackingProps }
				/>
			</>
		);
	}

	function renderCredentials() {
		return (
			<Credentials
				sourceSite={ sourceSite }
				targetSite={ targetSite }
				migrationTrackingProps={ migrationTrackingProps }
				startImport={ startImport }
			/>
		);
	}

	// If the source site is not capable of being migrated, we show the update info screen
	if ( requiresPluginUpdate ) {
		return renderUpdatePluginInfo();
	}

	if ( showCredentials && sourceSite ) {
		return renderCredentials();
	}

	// If the target site is plan compatible, we show the pre-migration screen
	if ( isTargetSitePlanCompatible ) {
		return renderPreMigration();
	}

	// If the target site is not plan compatible, we show the upgrade plan screen
	return renderUpgradePlan();
};

export default PreMigrationScreen;
