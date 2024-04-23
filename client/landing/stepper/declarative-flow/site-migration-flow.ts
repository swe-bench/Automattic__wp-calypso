import { isEnabled } from '@automattic/calypso-config';
import { PLAN_MIGRATION_TRIAL_MONTHLY } from '@automattic/calypso-products';
import { useLocale } from '@automattic/i18n-utils';
import { isSiteMigrationSignupFlow } from '@automattic/onboarding';
import { useSelect } from '@wordpress/data';
import { useEffect } from 'react';
import { getLocaleFromQueryParam, getLocaleFromPathname } from 'calypso/boot/locale';
import { HOSTING_INTENT_MIGRATE } from 'calypso/data/hosting/use-add-hosting-trial-mutation';
import { useIsSiteOwner } from 'calypso/landing/stepper/hooks/use-is-site-owner';
import { useQuery } from 'calypso/landing/stepper/hooks/use-query';
import { addQueryArgs } from 'calypso/lib/url';
import wpcom from 'calypso/lib/wp';
import { useSiteData } from '../hooks/use-site-data';
import { useSiteSlugParam } from '../hooks/use-site-slug-param';
import { USER_STORE, ONBOARD_STORE, SITE_STORE } from '../stores';
import { goToCheckout } from '../utils/checkout';
import { getLoginUrl } from '../utils/path';
import { recordSubmitStep } from './internals/analytics/record-submit-step';
import { STEPS } from './internals/steps';
import { type SiteMigrationIdentifyAction } from './internals/steps-repository/site-migration-identify';
import { AssertConditionState } from './internals/types';
import type { AssertConditionResult, Flow, ProvidedDependencies } from './internals/types';
import type { OnboardSelect, SiteSelect, UserSelect } from '@automattic/data-stores';

const FLOW_NAME = 'site-migration';

const siteMigration: Flow = {
	name: FLOW_NAME,
	isSignupFlow: false,

	useSteps() {
		const coreSteps = [
			STEPS.SITE_MIGRATION_IDENTIFY,
			STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE,
			STEPS.BUNDLE_TRANSFER,
			STEPS.SITE_MIGRATION_PLUGIN_INSTALL,
			STEPS.PROCESSING,
			STEPS.SITE_MIGRATION_UPGRADE_PLAN,
			STEPS.VERIFY_EMAIL,
			STEPS.SITE_MIGRATION_ASSIGN_TRIAL_PLAN,
			STEPS.SITE_MIGRATION_INSTRUCTIONS,
			STEPS.SITE_MIGRATION_INSTRUCTIONS_I2,
			STEPS.ERROR,
		];

		if ( ! isSiteMigrationSignupFlow( this.variantSlug ?? this.name ) ) {
			return coreSteps;
		}

		return [ ...coreSteps, STEPS.SITE_CREATION_STEP ];
	},
	useAssertConditions(): AssertConditionResult {
		const { siteSlug, siteId } = useSiteData();
		const userIsLoggedIn = useSelect(
			( select ) => ( select( USER_STORE ) as UserSelect ).isCurrentUserLoggedIn(),
			[]
		);

		let result: AssertConditionResult = { state: AssertConditionState.SUCCESS };
		const { isOwner } = useIsSiteOwner();

		const flowName = this.variantSlug ?? this.name;
		const isSignupFlow = isSiteMigrationSignupFlow( this.variantSlug ?? this.name );

		// There is a race condition where useLocale is reporting english,
		// despite there being a locale in the URL so we need to look it up manually.
		// We also need to support both query param and path suffix localized urls
		// depending on where the user is coming from.
		const useLocaleSlug = useLocale();
		// Query param support can be removed after dotcom-forge/issues/2960 and 2961 are closed.
		const queryLocaleSlug = getLocaleFromQueryParam();
		const pathLocaleSlug = getLocaleFromPathname();
		const locale = queryLocaleSlug || pathLocaleSlug || useLocaleSlug;

		const queryParams = new URLSearchParams( window.location.search );
		const aff = queryParams.get( 'aff' );
		const vendorId = queryParams.get( 'vid' );

		const getStartUrl = () => {
			let hasFlowParams = false;
			const flowParams = new URLSearchParams();
			const queryParams = new URLSearchParams();

			if ( vendorId ) {
				queryParams.set( 'vid', vendorId );
			}

			if ( aff ) {
				queryParams.set( 'aff', aff );
			}

			if ( locale && locale !== 'en' ) {
				flowParams.set( 'locale', locale );
				hasFlowParams = true;
			}

			const redirectTarget =
				`/setup/${ flowName }` +
				( hasFlowParams ? encodeURIComponent( '?' + flowParams.toString() ) : '' );

			let queryString = `redirect_to=${ redirectTarget }`;

			if ( queryParams.toString() ) {
				queryString = `${ queryString }&${ queryParams.toString() }`;
			}

			const logInUrl = getLoginUrl( {
				variationName: flowName,
				locale,
			} );

			return `${ logInUrl }&${ queryString }`;
		};

		useEffect( () => {
			if ( ! userIsLoggedIn ) {
				const logInUrl = getStartUrl();
				window.location.assign( logInUrl );
			}
		}, [] );

		useEffect( () => {
			if ( isOwner === false && ! isSignupFlow ) {
				window.location.assign( '/start' );
			}
		}, [ isOwner, isSignupFlow ] );

		if ( ! userIsLoggedIn ) {
			result = {
				state: AssertConditionState.FAILURE,
				message: 'site-migration requires a logged in user',
			};
		}

		if ( ! siteSlug && ! siteId && ! isSignupFlow ) {
			window.location.assign( '/start' );
			result = {
				state: AssertConditionState.FAILURE,
				message: 'site-setup did not provide the site slug or site id it is configured to.',
			};
		}

		return result;
	},

	useStepNavigation( currentStep, navigate ) {
		const flowName = this.name;
		const variantSlug = this.variantSlug;
		const flowPath = variantSlug ?? flowName;
		const intent = useSelect(
			( select ) => ( select( ONBOARD_STORE ) as OnboardSelect ).getIntent(),
			[]
		);
		const siteSlugParam = useSiteSlugParam();
		const urlQueryParams = useQuery();
		const fromQueryParam = urlQueryParams.get( 'from' );
		const { getSiteIdBySlug } = useSelect( ( select ) => select( SITE_STORE ) as SiteSelect, [] );
		const exitFlow = ( to: string ) => {
			window.location.assign( to );
		};
		const isSignupFlow = isSiteMigrationSignupFlow( flowPath );

		const saveSiteSettings = async ( siteSlug: string, settings: Record< string, unknown > ) => {
			return wpcom.req.post(
				`/sites/${ siteSlug }/settings`,
				{
					apiVersion: '1.4',
				},
				{
					...settings,
				}
			);
		};

		// TODO - We may need to add `...params: string[]` back once we start adding more steps.
		async function submit( providedDependencies: ProvidedDependencies = {} ) {
			recordSubmitStep( providedDependencies, intent, flowName, currentStep, variantSlug );
			const siteSlug = ( providedDependencies?.siteSlug as string ) || siteSlugParam || '';
			const siteId = getSiteIdBySlug( siteSlug );

			switch ( currentStep ) {
				case STEPS.SITE_MIGRATION_IDENTIFY.slug: {
					const { from, platform, action } = providedDependencies as {
						from: string;
						platform: string;
						action: SiteMigrationIdentifyAction;
					};

					if ( action === 'skip_platform_identification' || platform !== 'wordpress' ) {
						return exitFlow(
							addQueryArgs(
								{
									siteId,
									siteSlug,
									from,
									origin: STEPS.SITE_MIGRATION_IDENTIFY.slug,
									backToFlow: `/${ flowPath }/${ STEPS.SITE_MIGRATION_IDENTIFY.slug }`,
								},
								'/setup/site-setup/importList'
							)
						);
					}

					return navigate(
						addQueryArgs(
							{ from: from, siteSlug, siteId },
							STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE.slug
						)
					);
				}
				case STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE.slug: {
					// Switch to the normal Import flow.
					if ( providedDependencies?.destination === 'import' ) {
						return exitFlow(
							addQueryArgs(
								{
									siteSlug,
									siteId,
									backToFlow: `/${ flowPath }/${ STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE.slug }`,
								},
								'/setup/site-setup/importList'
							)
						);
					}

					// Take the user to the upgrade plan step.
					if ( providedDependencies?.destination === 'upgrade' ) {
						// TODO - Once the upgrade plan step is available, we'll want to change this to use the slug constant.
						return navigate( 'site-migration-upgrade-plan', {
							siteId,
							siteSlug,
						} );
					}

					// Continue with the migration flow.
					return navigate( STEPS.BUNDLE_TRANSFER.slug, {
						siteId,
						siteSlug,
					} );
				}

				case STEPS.BUNDLE_TRANSFER.slug: {
					if ( isEnabled( 'migration-flow/remove-processing-step' ) ) {
						return navigate(
							addQueryArgs( { siteSlug, siteId }, STEPS.SITE_MIGRATION_INSTRUCTIONS_I2.slug )
						);
					}
					return navigate( STEPS.PROCESSING.slug, { bundleProcessing: true } );
				}

				case STEPS.SITE_MIGRATION_PLUGIN_INSTALL.slug: {
					return navigate( STEPS.PROCESSING.slug, { pluginInstall: true } );
				}

				case STEPS.PROCESSING.slug: {
					// Any process errors go to the error step.
					if ( providedDependencies?.error ) {
						return navigate( STEPS.ERROR.slug );
					}

					if ( providedDependencies?.createSite ) {
						return navigate( addQueryArgs( { siteSlug }, STEPS.SITE_MIGRATION_IDENTIFY.slug ) );
					}

					// If the plugin was installed successfully, go to the migration instructions.
					if ( providedDependencies?.pluginInstall ) {
						if ( siteSlug ) {
							// Remove the in_site_migration_flow option at the end of the flow.
							await saveSiteSettings( siteSlug, {
								in_site_migration_flow: '',
							} );
						}

						return navigate( STEPS.SITE_MIGRATION_INSTRUCTIONS.slug );
					}

					// Otherwise processing has finished from the BundleTransfer step and we need to install the plugin.
					return navigate( STEPS.SITE_MIGRATION_PLUGIN_INSTALL.slug );
				}

				case STEPS.VERIFY_EMAIL.slug: {
					return navigate( STEPS.SITE_MIGRATION_ASSIGN_TRIAL_PLAN.slug );
				}

				case STEPS.SITE_MIGRATION_ASSIGN_TRIAL_PLAN.slug: {
					if ( providedDependencies?.error ) {
						return navigate( STEPS.ERROR.slug );
					}

					return navigate( STEPS.BUNDLE_TRANSFER.slug, {
						siteId,
						siteSlug,
					} );
				}

				case STEPS.SITE_MIGRATION_UPGRADE_PLAN.slug: {
					if ( providedDependencies?.verifyEmail ) {
						if ( siteSlug ) {
							// Set the in_site_migration_flow option if the user needs to be verified.
							await saveSiteSettings( siteSlug, {
								in_site_migration_flow: flowName,
							} );
						}
						return navigate( STEPS.VERIFY_EMAIL.slug );
					}

					if ( providedDependencies?.goToCheckout ) {
						const destination = addQueryArgs(
							{
								siteSlug,
								from: fromQueryParam,
							},
							`/setup/${ flowPath }/${ STEPS.BUNDLE_TRANSFER.slug }`
						);

						urlQueryParams.delete( 'showModal' );
						goToCheckout( {
							flowName: FLOW_NAME,
							stepName: STEPS.SITE_MIGRATION_UPGRADE_PLAN.slug,
							siteSlug: siteSlug,
							destination: destination,
							plan: providedDependencies.plan as string,
							cancelDestination: `/setup/${ FLOW_NAME }/${
								STEPS.SITE_MIGRATION_UPGRADE_PLAN.slug
							}?${ urlQueryParams.toString() }`,
							extraQueryParams:
								providedDependencies?.sendIntentWhenCreatingTrial &&
								providedDependencies?.plan === PLAN_MIGRATION_TRIAL_MONTHLY
									? { hosting_intent: HOSTING_INTENT_MIGRATE }
									: {},
						} );
						return;
					}
				}

				case STEPS.SITE_MIGRATION_INSTRUCTIONS.slug: {
					return exitFlow( `/home/${ siteSlug }` );
				}

				case STEPS.SITE_CREATION_STEP.slug: {
					return navigate( STEPS.PROCESSING.slug, { createSite: true } );
				}
			}
		}

		const goBack = () => {
			switch ( currentStep ) {
				case STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE.slug: {
					return navigate( STEPS.SITE_MIGRATION_IDENTIFY.slug );
				}
				case STEPS.SITE_MIGRATION_IDENTIFY.slug: {
					if ( ! isSignupFlow ) {
						return exitFlow( `/setup/site-setup/goals?${ urlQueryParams }` );
					}
				}

				case STEPS.SITE_MIGRATION_UPGRADE_PLAN.slug: {
					if ( urlQueryParams.has( 'showModal' ) || ! isEnabled( 'migration_assistance_modal' ) ) {
						urlQueryParams.delete( 'showModal' );
						return navigate(
							`${ STEPS.SITE_MIGRATION_IMPORT_OR_MIGRATE.slug }?${ urlQueryParams }`
						);
					}
					if ( isEnabled( 'migration_assistance_modal' ) ) {
						urlQueryParams.set( 'showModal', 'true' );
					}

					return navigate( `site-migration-upgrade-plan?${ urlQueryParams.toString() }` );
				}
			}
		};

		return { goBack, submit, exitFlow };
	},

	useSideEffect( currentStep, navigate ) {
		const { siteId, siteSlug } = useSiteData();
		const isSignupFlow = isSiteMigrationSignupFlow( this.variantSlug ?? this.name );
		const isUserLoggedIn = useSelect(
			( select ) => ( select( USER_STORE ) as UserSelect ).isCurrentUserLoggedIn(),
			[]
		);

		useEffect( () => {
			if ( ! isSignupFlow || siteId || siteSlug || ! isUserLoggedIn ) {
				return;
			}

			if ( [ STEPS.SITE_CREATION_STEP.slug, STEPS.PROCESSING.slug ].includes( currentStep ) ) {
				return;
			}

			// We're in a signup flow with a valid user, but we don't have a site and we're not on a site creation step
			navigate( STEPS.SITE_CREATION_STEP.slug );
		}, [ isSignupFlow, siteId, siteSlug ] );
	},
};

export default siteMigration;
