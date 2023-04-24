/**
 * @jest-environment jsdom
 */
import { redirectOnboardingUserAfterPublishingPost } from '../redirect-onboarding-user-after-publishing-post';

beforeAll( () => {} );

const mockUnSubscribe = jest.fn();
const mockClosePublishSidebar = jest.fn();
const mockCloseSidebar = jest.fn();
let mockSubscribeFunction = null;
let mockIsSaving = false;

jest.mock( '@wordpress/data', () => ( {
	subscribe: ( userFunction ) => {
		mockSubscribeFunction = userFunction;

		return mockUnSubscribe;
	},
	select: ( item ) => {
		if ( item === 'core/editor' ) {
			return {
				isSavingPost: () => mockIsSaving,
				isCurrentPostPublished: () => true,
				getCurrentPostRevisionsCount: () => 1,
			};
		}
	},
	dispatch: () => {
		return {
			closePublishSidebar: () => {
				mockClosePublishSidebar();
			},
			closeGeneralSidebar: () => {
				mockCloseSidebar();
			},
		};
	},
} ) );

describe( 'redirectOnboardingUserAfterPublishingPost', () => {
	it( 'should NOT redirect the user to the launchpad if start-writing query parameter is NOT present', () => {
		delete global.window;
		global.window = {
			location: {
				search: 'origin=https://calypso.localhost:3000',
				hostname: 'wordpress.com',
			},
		};

		redirectOnboardingUserAfterPublishingPost();

		expect( mockCloseSidebar ).toBeCalledTimes( 0 );
		expect( mockSubscribeFunction ).toBe( null );
		expect( global.window.location.href ).toBe( undefined );
	} );

	it( 'should NOT redirect while saving the POST', () => {
		mockIsSaving = true;
		delete global.window;
		global.window = {
			location: {
				search: '?start-writing=true&origin=https://calypso.localhost:3000',
				hostname: 'wordpress.com',
			},
		};

		redirectOnboardingUserAfterPublishingPost();

		expect( mockCloseSidebar ).toBeCalledTimes( 1 );
		expect( mockSubscribeFunction ).not.toBe( null );

		mockSubscribeFunction();

		expect( mockUnSubscribe ).toBeCalledTimes( 0 );
		expect( global.window.location.href ).toBe( undefined );
	} );

	it( 'should redirect the user to the launchpad when a post is published and the start-writing query parameter is present', () => {
		jest.clearAllMocks();
		mockIsSaving = false;
		delete global.window;
		global.window = {
			location: {
				search: '?start-writing=true&origin=https://calypso.localhost:3000',
				hostname: 'wordpress.com',
			},
		};

		redirectOnboardingUserAfterPublishingPost();
		mockSubscribeFunction();

		expect( mockSubscribeFunction ).not.toBe( null );
		expect( mockCloseSidebar ).toBeCalledTimes( 1 );
		expect( mockUnSubscribe ).toBeCalledTimes( 1 );
		expect( mockClosePublishSidebar ).toBeCalledTimes( 1 );
		expect( global.window.location.href ).toBe(
			'https://calypso.localhost:3000/setup/write/launchpad?siteSlug=wordpress.com&start-writing=true'
		);
	} );
} );
