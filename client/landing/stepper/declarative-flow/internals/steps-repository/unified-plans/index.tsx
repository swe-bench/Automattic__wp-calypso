import { OnboardSelect } from '@automattic/data-stores';
import { StepContainer } from '@automattic/onboarding';
import { useSelect } from '@wordpress/data';
import { localize } from 'i18n-calypso';
import { useDispatch } from 'react-redux';
import { useQuery } from 'calypso/landing/stepper/hooks/use-query';
import { useSite } from 'calypso/landing/stepper/hooks/use-site';
import { useSiteSlug } from 'calypso/landing/stepper/hooks/use-site-slug';
import { ONBOARD_STORE } from 'calypso/landing/stepper/stores';
import { PlansStep } from 'calypso/signup/steps/plans';
import { useSelector } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getCurrentUserName } from 'calypso/state/current-user/selectors';
import { errorNotice } from 'calypso/state/notices/actions';
import { useStepperPersistedState } from '../../hooks/use-persisted-state';
import { ProvidedDependencies, StepProps } from '../../types';
import './styles.scss';

export const LocalizedPlanStep = localize( PlansStep );

export default function PlansStepAdaptor( props: StepProps ) {
	const [ stepState, setStepState ] = useStepperPersistedState< ProvidedDependencies >();
	const siteSlug = useSiteSlug();
	const siteTitle = useSelect(
		( select ) => ( select( ONBOARD_STORE ) as OnboardSelect ).getSelectedSiteTitle(),
		[]
	);
	const username = useSelector( getCurrentUserName );
	const coupon = undefined;

	const signupDependencies = {
		siteSlug,
		siteTitle,
		username,
		coupon,
	};

	const site = useSite();
	const customerType = useQuery().get( 'customerType' );
	const dispatch = useDispatch();

	return (
		<LocalizedPlanStep
			selectedSite={ site }
			saveSignupStep={ ( state: ProvidedDependencies ) =>
				setStepState( { ...stepState, ...state } )
			}
			submitSignupStep={ ( state: ProvidedDependencies ) =>
				props.navigation.submit?.( { ...stepState, ...state } )
			}
			goToNextStep={ () => props.navigation.submit?.( stepState ) }
			step={ stepState }
			customerType={ customerType }
			errorNotice={ ( message: string ) => dispatch( errorNotice( message ) ) }
			signupDependencies={ signupDependencies }
			stepName="plans"
			flowName={ props.flow }
			renderWithoutStepWrapper
			recordTracksEvent={ ( event: unknown ) => dispatch( recordTracksEvent( event ) ) }
			CustomStepWrapper={ usePlanStepWrapper( props.navigation ) }
		/>
	);
}

function usePlanStepWrapper( navigation: StepProps[ 'navigation' ] ) {
	const dispatch = useDispatch();

	return ( props: Parameters< typeof StepContainer >[ 0 ] ) => (
		<StepContainer
			{ ...props }
			goBack={ navigation.goBack }
			recordTracksEvent={ ( event: unknown ) => dispatch( recordTracksEvent( event ) ) }
			isFullLayout
			isExtraWideLayout={ false }
		/>
	);
}
