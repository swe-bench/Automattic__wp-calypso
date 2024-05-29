import { isAnyHostingFlow } from '@automattic/onboarding';
import classnames from 'classnames';
import { useEffect } from 'react';
import { getStepOldSlug } from 'calypso/landing/stepper/declarative-flow/helpers/get-step-old-slug';
import { getAssemblerSource } from 'calypso/landing/stepper/declarative-flow/internals/analytics/record-design';
import recordStepStart from 'calypso/landing/stepper/declarative-flow/internals/analytics/record-step-start';
import { useIntent } from 'calypso/landing/stepper/hooks/use-intent';
import { useLoginUrlForFlow } from 'calypso/landing/stepper/hooks/use-login-url-for-flow';
import { useSelectedDesign } from 'calypso/landing/stepper/hooks/use-selected-design';
import { useSiteData } from 'calypso/landing/stepper/hooks/use-site-data';
import kebabCase from 'calypso/landing/stepper/utils/kebabCase';
import { recordPageView } from 'calypso/lib/analytics/page-view';
import SignupHeader from 'calypso/signup/signup-header';
import {
	getSignupCompleteFlowNameAndClear,
	getSignupCompleteStepNameAndClear,
} from 'calypso/signup/storageUtils';
import { useSelector } from 'calypso/state';
import { isUserLoggedIn } from 'calypso/state/current-user/selectors';
import { getSite, isRequestingSite } from 'calypso/state/sites/selectors';
import VideoPressIntroBackground from '../../steps-repository/intro/videopress-intro-background';
import type { Flow, StepperStep } from '../../types';

type StepRouteProps = {
	step: StepperStep;
	flow: Flow;
	showWooLogo: boolean;
	renderStep: ( step: StepperStep ) => JSX.Element | null;
};

//TODO: Check we can move RenderStep function to here and remove the renderStep prop
const StepRoute = ( { step, flow, showWooLogo, renderStep }: StepRouteProps ) => {
	const userIsLoggedIn = useSelector( isUserLoggedIn );
	const loginUrl = useLoginUrlForFlow( { flow } );
	const stepContent = renderStep( step );
	const { site, siteSlugOrId } = useSiteData();

	// Ensure that the selected site is fetched, if available. This is used for event tracking purposes.
	// See https://github.com/Automattic/wp-calypso/pull/82981.

	// TODO: Check if it is duplicated with the useSiteData hook
	const selectedSite = useSelector( ( state ) => site && getSite( state, siteSlugOrId ) );
	const isRequestingSelectedSite = useSelector(
		( state ) => site && isRequestingSite( state, siteSlugOrId )
	);
	const intent = useIntent();
	const design = useSelectedDesign();

	// Short-circuit this if the site slug or ID is not available.
	const hasRequestedSelectedSite = siteSlugOrId
		? !! selectedSite && ! isRequestingSelectedSite
		: true;

	useEffect( () => {
		if ( ! step.requiresLoggedInUser || userIsLoggedIn ) {
			return;
		}

		window.location.assign( loginUrl );
	}, [ step, loginUrl, userIsLoggedIn ] );

	//TODO: Move this logic to a separate hook
	useEffect( () => {
		// We record the event only when the step is not empty. Additionally, we should not fire this event whenever the intent is changed
		if ( ! hasRequestedSelectedSite ) {
			return;
		}

		// If we're redirecting in the effect above, skip any step or page tracking.
		if ( step.requiresLoggedInUser && ! userIsLoggedIn ) {
			return;
		}

		if ( ! stepContent ) {
			return;
		}

		const signupCompleteFlowName = getSignupCompleteFlowNameAndClear();
		const signupCompleteStepName = getSignupCompleteStepNameAndClear();

		const isReEnteringStep =
			signupCompleteFlowName === flow.name && signupCompleteStepName === step.slug;

		if ( ! isReEnteringStep ) {
			recordStepStart( flow.name, kebabCase( step.slug ), {
				intent,
				is_in_hosting_flow: isAnyHostingFlow( flow.name ),
				...( design && { assembler_source: getAssemblerSource( design ) } ),
			} );

			const stepOldSlug = getStepOldSlug( step.slug );

			if ( stepOldSlug ) {
				recordStepStart( flow.name, kebabCase( stepOldSlug ), {
					intent,
					is_in_hosting_flow: isAnyHostingFlow( flow.name ),
					...( design && { assembler_source: getAssemblerSource( design ) } ),
				} );
			}
		}

		// Also record page view for data and analytics
		const pathname = window.location.pathname || '';
		const pageTitle = `Setup > ${ flow.name } > ${ step.slug }`;
		recordPageView( pathname, pageTitle );

		// We leave out intent and design from the dependency list, due to the ONBOARD_STORE being reset in the exit flow.
		// The store reset causes these values to become empty, and may trigger this event again.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ flow.name, hasRequestedSelectedSite, step.slug, step.requiresLoggedInUser ] );

	if ( step.requiresLoggedInUser && ! userIsLoggedIn ) {
		return null;
	}

	//TODO: Extract the layout logics to another component;
	return (
		<div
			className={ classnames(
				'step-route',
				flow.name,
				flow.variantSlug,
				flow.classnames,
				kebabCase( step.slug )
			) }
		>
			{ 'videopress' === flow.name && 'intro' === step.slug && <VideoPressIntroBackground /> }
			{ stepContent && <SignupHeader pageTitle={ flow.title } showWooLogo={ showWooLogo } /> }
			{ stepContent }
		</div>
	);
};

export default StepRoute;
