import { type OnboardSelect } from '@automattic/data-stores';
import { isAssemblerDesign } from '@automattic/design-picker';
import { FREE_FLOW } from '@automattic/onboarding';
import { useSelect, useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { translate } from 'i18n-calypso';
import { useEffect } from 'react';
import { skipLaunchpad } from 'calypso/landing/stepper/utils/skip-launchpad';
import { triggerGuidesForStep } from 'calypso/lib/guides/trigger-guides-for-step';
import {
	setSignupCompleteSlug,
	persistSignupDestination,
	setSignupCompleteFlowName,
} from 'calypso/signup/storageUtils';
import { useSiteIdParam } from '../hooks/use-site-id-param';
import { useSiteSlug } from '../hooks/use-site-slug';
import { ONBOARD_STORE } from '../stores';
import { stepsWithRequiredLogin } from '../utils/steps-with-required-login';
import { recordSubmitStep } from './internals/analytics/record-submit-step';
import { useLaunchpadDecider } from './internals/hooks/use-launchpad-decider';
import { STEPS } from './internals/steps';
import { ProcessingResult } from './internals/steps-repository/processing-step/constants';
import { Flow, ProvidedDependencies } from './internals/types';

const free: Flow = {
	name: FREE_FLOW,
	get title() {
		return translate( 'Free' );
	},
	isSignupFlow: true,
	useSteps() {
		const { resetOnboardStore } = useDispatch( ONBOARD_STORE );

		useEffect( () => {
			resetOnboardStore();
		}, [] );

		return stepsWithRequiredLogin( [
			STEPS.FREE_SETUP,
			STEPS.PROCESSING,
			STEPS.SITE_CREATION_STEP,
			STEPS.LAUNCHPAD,
			STEPS.DESIGN_SETUP,
			STEPS.PATTERN_ASSEMBLER,
			STEPS.ERROR,
		] );
	},

	useStepNavigation( _currentStep, navigate ) {
		const flowName = this.name;
		const { setPendingAction } = useDispatch( ONBOARD_STORE );
		const siteId = useSiteIdParam();
		const siteSlug = useSiteSlug();
		const selectedDesign = useSelect(
			( select ) => ( select( ONBOARD_STORE ) as OnboardSelect ).getSelectedDesign(),
			[]
		);

		triggerGuidesForStep( flowName, _currentStep );

		const exitFlow = ( to: string ) => {
			setPendingAction( () => {
				return new Promise( () => {
					window.location.assign( to );
				} );
			} );

			return navigate( 'processing' );
		};

		const { getPostFlowUrl, postFlowNavigator, initializeLaunchpadState } = useLaunchpadDecider( {
			exitFlow,
			navigate,
		} );

		const submit = ( providedDependencies: ProvidedDependencies = {}, ...results: string[] ) => {
			recordSubmitStep( providedDependencies, '', flowName, _currentStep );

			switch ( _currentStep ) {
				case 'freeSetup':
					return navigate( 'create-site' );

				case 'create-site':
					return navigate( 'processing' );

				case 'processing':
					if ( results.some( ( result ) => result === ProcessingResult.FAILURE ) ) {
						return navigate( 'error' );
					}

					if ( providedDependencies?.goToHome && providedDependencies?.siteSlug ) {
						return window.location.replace(
							addQueryArgs( `/home/${ siteId ?? providedDependencies?.siteSlug }`, {
								celebrateLaunch: true,
								launchpadComplete: true,
							} )
						);
					}

					if ( isAssemblerDesign( selectedDesign ) ) {
						const params = new URLSearchParams( {
							canvas: 'edit',
							assembler: '1',
						} );

						return exitFlow( `/site-editor/${ siteSlug }?${ params }` );
					}

					if ( selectedDesign ) {
						return postFlowNavigator( { siteId, siteSlug } );
					}

					return navigate( `designSetup?siteSlug=${ providedDependencies?.siteSlug }` );

				case 'designSetup':
					if ( providedDependencies?.goToCheckout ) {
						const destination = getPostFlowUrl( {
							flow: flowName,
							siteSlug: providedDependencies.siteSlug as string,
						} );
						persistSignupDestination( destination );
						setSignupCompleteSlug( providedDependencies?.siteSlug );
						setSignupCompleteFlowName( flowName );
						initializeLaunchpadState( {
							siteId,
							siteSlug: providedDependencies.siteSlug as string,
						} );
						const returnUrl = encodeURIComponent( destination );

						return window.location.assign(
							`/checkout/${ encodeURIComponent(
								( providedDependencies?.siteSlug as string ) ?? ''
							) }?redirect_to=${ returnUrl }&signup=1`
						);
					}

					if ( providedDependencies?.shouldGoToAssembler ) {
						return navigate( 'pattern-assembler' );
					}

					return navigate( `processing?siteSlug=${ siteSlug }` );

				case 'pattern-assembler': {
					return navigate( `processing?siteSlug=${ siteSlug }` );
				}

				case 'launchpad': {
					return navigate( 'processing' );
				}
			}
			return providedDependencies;
		};

		const goBack = () => {
			switch ( _currentStep ) {
				case 'pattern-assembler':
					return navigate( 'designSetup' );
			}
		};

		const goNext = async () => {
			switch ( _currentStep ) {
				case 'launchpad':
					skipLaunchpad( {
						checklistSlug: 'free',
						siteId,
						siteSlug,
					} );
					return;

				default:
					return navigate( 'freeSetup' );
			}
		};

		const goToStep = ( step: string ) => {
			navigate( step );
		};

		return { goNext, goBack, goToStep, submit };
	},
};

export default free;
