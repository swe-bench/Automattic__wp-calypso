import { recordTracksEvent } from '@automattic/calypso-analytics';
import { isEnabled } from '@automattic/calypso-config';
import { Button, Gridicon, useScrollToTop, JetpackLogo } from '@automattic/components';
import { createSitesListComponent } from '@automattic/sites';
import { useMobileBreakpoint } from '@automattic/viewport-react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { createInterpolateElement } from '@wordpress/element';
import { sprintf } from '@wordpress/i18n';
import { Icon, download } from '@wordpress/icons';
import { useI18n } from '@wordpress/react-i18n';
import { addQueryArgs } from '@wordpress/url';
import { useCallback, useEffect, useRef, useContext } from 'react';
import DocumentHead from 'calypso/components/data/document-head';
import JetpackSitesDashboard from 'calypso/components/jetpack-sites-dashboard';
import JetpackSitesDashboardContext from 'calypso/components/jetpack-sites-dashboard/jetpack-sites-dashboard-context';
import Pagination from 'calypso/components/pagination';
import PopoverMenuItem from 'calypso/components/popover-menu/item';
import SplitButton from 'calypso/components/split-button';
import { useSiteExcerptsQuery } from 'calypso/data/sites/use-site-excerpts-query';
import { useAddNewSiteUrl } from 'calypso/lib/paths/use-add-new-site-url';
import { withoutHttp } from 'calypso/lib/url';
import { useDispatch } from 'calypso/state';
import { successNotice } from 'calypso/state/notices/actions';
import { useSitesSorting } from 'calypso/state/sites/hooks/use-sites-sorting';
import { useSitesDashboardImportSiteUrl } from '../hooks/use-sites-dashboard-import-site-url';
import { MEDIA_QUERIES, TRACK_SOURCE_NAME } from '../utils';
import { HostingCommandPaletteBanner } from './hosting-command-palette-banner';
import { NoSitesMessage } from './no-sites-message';
import {
	SitesDashboardQueryParams,
	SitesContentControls,
	handleQueryParamChange,
} from './sites-content-controls';
import { SitesTable } from './sites-table';
import type { SiteExcerptData } from '@automattic/sites';

interface SitesDashboardProps {
	queryParams: SitesDashboardQueryParams;
}

const MAX_PAGE_WIDTH = '1224px';

// Two wrappers are necessary (both pagePadding _and_ wideCentered) because we
// want there to be some padding that extends all around the page, but the header's
// background color and border needs to be able to extend into that padding.
const pagePadding = {
	paddingInlineStart: '32px',
	paddingInlineEnd: '32px',

	[ MEDIA_QUERIES.mediumOrSmaller ]: {
		paddingInlineStart: '16px',
		paddingInlineEnd: '16px',
	},
};

const PageHeader = styled.div( {
	...pagePadding,

	backgroundColor: 'var( --studio-white )',

	paddingBlockEnd: '24px',

	[ MEDIA_QUERIES.mediumOrSmaller ]: {
		padding: '16px',
	},
} );

const PageBodyWrapper = styled.div( {
	...pagePadding,
	maxWidth: MAX_PAGE_WIDTH,
	marginBlock: 0,
	marginInline: 'auto',
} );

const HeaderControls = styled.div( {
	maxWidth: MAX_PAGE_WIDTH,
	marginBlock: 0,
	marginInline: 'auto',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
} );

const DashboardHeading = styled.h1( {
	fontWeight: 500,
	fontSize: '20px',
	lineHeight: '26px',
	color: 'var( --studio-gray-100 )',
	flex: 1,
	marginInlineEnd: '1rem',
} );

const sitesMarginTable = css( {
	backgroundColor: 'var( --studio-white )',
	marginBlockStart: '14px',
	marginInline: 0,
	marginBlockEnd: '1.5em',
	[ MEDIA_QUERIES.small ]: {
		marginBlockStart: '0',
	},
} );

export const PageBodyBottomContainer = styled.div( {
	color: 'var( --color-text-subtle )',
	paddingBlockStart: '16px',
	paddingBlockEnd: '24px',
	gap: '24px',
	display: 'flex',
	flexDirection: 'column',
	[ MEDIA_QUERIES.mediumOrSmaller ]: {
		paddingBlockEnd: '48px',
	},
} );

const HiddenSitesMessageContainer = styled.div( {
	fontSize: '14px',
	paddingInline: 0,
	textAlign: 'center',
} );

const HiddenSitesMessage = styled.div( {
	marginBlockEnd: '1em',
} );

const ScrollButton = styled( Button, { shouldForwardProp: ( prop ) => prop !== 'visible' } )< {
	visible: boolean;
} >`
	position: fixed;
	display: flex;
	opacity: ${ ( props ) => ( props.visible ? 1 : 0 ) };
	align-items: center;
	justify-content: center;
	inset-block-end: 24px;
	inset-inline-start: 24px;
	height: 42px;
	width: 42px;
	background-color: #000;
	color: #fff;
	border-radius: 4px;
	transition: opacity 0.3s ease-in-out;
	.gridicon {
		top: initial;
		margin-top: initial;
	}
`;

const ManageAllDomainsButton = styled( Button )`
	margin-inline-end: 1rem;
	white-space: nowrap;
`;

const DownloadIcon = styled( Icon )`
	margin-right: 8px;
	vertical-align: bottom;
`;

const popoverHoverStyles = css`
	&:hover,
	&:focus {
		fill: var( --color-text-inverted );
	}
`;

const StyledHostingCommandPaletteBanner = styled( HostingCommandPaletteBanner )( {
	maxWidth: MAX_PAGE_WIDTH,
} );

const SitesDashboardSitesList = createSitesListComponent();

export function SitesDashboard( {
	queryParams: { page = 1, perPage = 96, search, status = 'all', newSiteID },
}: SitesDashboardProps ) {
	const createSiteUrl = useAddNewSiteUrl( {
		source: TRACK_SOURCE_NAME,
		ref: 'topbar',
	} );
	const importSiteUrl = useSitesDashboardImportSiteUrl( {
		ref: 'topbar',
	} );
	const { __, _n } = useI18n();
	const { data: liveSites = [], isLoading } = useSiteExcerptsQuery(
		[],
		( site ) => ! site.options?.is_domain_only
	);

	const { data: deletedSites = [] } = useSiteExcerptsQuery(
		[],
		( site ) => ! site.options?.is_domain_only,
		'deleted'
	);

	const { hasSitesSortingPreferenceLoaded, sitesSorting, onSitesSortingChange } = useSitesSorting();
	const elementRef = useRef( window );

	const isBelowThreshold = useCallback( ( containerNode: Window ) => {
		const SCROLL_THRESHOLD = containerNode.innerHeight;

		return containerNode.scrollY > SCROLL_THRESHOLD;
	}, [] );

	const { isButtonVisible, scrollToTop } = useScrollToTop( {
		scrollTargetRef: elementRef,
		isBelowThreshold,
		smoothScrolling: true,
	} );

	const isMobile = useMobileBreakpoint();

	const allSites = liveSites.concat( deletedSites );

	useShowSiteCreationNotice( allSites, newSiteID );
	useShowSiteTransferredNotice();

	const { openSitePreviewPane } = useContext( JetpackSitesDashboardContext );

	if ( isEnabled( 'layout/dotcom-nav-redesign-v2' ) ) {
		const fields = [
			{
				id: 'site',
				header: __( 'Site' ),
				getValue: ( { item } ) => item.URL,
				render: ( { item } ) => {
					return (
						<Button onClick={ () => openSitePreviewPane() }>
							<>{ item.title }</>
						</Button>
					);
				},
				enableHiding: false,
				enableSorting: true,
			},
			{
				id: 'plan',
				header: __( 'Plan' ),
				getValue: () => '-',
				enableHiding: false,
				enableSorting: false,
			},
			{
				id: 'status',
				header: __( 'Status' ),
				getValue: () => '-',
				enableHiding: false,
				enableSorting: false,
			},
			{
				id: 'last-publish',
				header: __( 'Last Publish' ),
				getValue: () => '-',
				enableHiding: false,
				enableSorting: true,
			},
			{
				id: 'stats',
				header: __( 'Stats' ),
				getValue: () => '-',
				enableHiding: false,
				enableSorting: false,
			},
			{
				id: 'actions',
				header: __( 'Actions' ),
				getValue: () => '-',
				enableHiding: false,
				enableSorting: false,
			},
		];
		return <JetpackSitesDashboard data={ allSites } fields={ fields } />;
	}
	return (
		<main>
			<DocumentHead title={ __( 'Sites' ) } />
			<PageHeader>
				<StyledHostingCommandPaletteBanner />
				<HeaderControls>
					<DashboardHeading>{ __( 'Sites' ) }</DashboardHeading>
					<ManageAllDomainsButton href="/domains/manage">
						{ __( 'Manage all domains' ) }
					</ManageAllDomainsButton>
					<SplitButton
						primary
						whiteSeparator
						label={ isMobile ? undefined : __( 'Add new site' ) }
						onClick={ () => {
							recordTracksEvent( 'calypso_sites_dashboard_new_site_action_click_add' );
						} }
						href={ createSiteUrl }
						toggleIcon={ isMobile ? 'plus' : undefined }
					>
						<PopoverMenuItem
							onClick={ () => {
								recordTracksEvent( 'calypso_sites_dashboard_new_site_action_click_jetpack' );
							} }
							href={ addQueryArgs( '/jetpack/connect', {
								cta_from: TRACK_SOURCE_NAME,
								cta_id: 'add-site',
							} ) }
						>
							<JetpackLogo className="gridicon" size={ 18 } />
							<span>{ __( 'Add Jetpack to a self-hosted site' ) }</span>
						</PopoverMenuItem>
						<PopoverMenuItem
							className={ `${ popoverHoverStyles }` }
							onClick={ () => {
								recordTracksEvent( 'calypso_sites_dashboard_new_site_action_click_import' );
							} }
							href={ importSiteUrl }
						>
							<DownloadIcon icon={ download } size={ 18 } />
							<span>{ __( 'Import an existing site' ) }</span>
						</PopoverMenuItem>
					</SplitButton>
				</HeaderControls>
			</PageHeader>
			<PageBodyWrapper>
				<SitesDashboardSitesList
					sites={ allSites }
					filtering={ { search } }
					sorting={ sitesSorting }
					grouping={ { status, showHidden: true } }
				>
					{ ( { sites, statuses } ) => {
						const paginatedSites = sites.slice( ( page - 1 ) * perPage, page * perPage );

						const selectedStatus =
							statuses.find( ( { name } ) => name === status ) || statuses[ 0 ];

						return (
							<>
								{ ( allSites.length > 0 || isLoading ) && (
									<SitesContentControls
										initialSearch={ search }
										statuses={ statuses }
										selectedStatus={ selectedStatus }
										sitesSorting={ sitesSorting }
										onSitesSortingChange={ onSitesSortingChange }
										hasSitesSortingPreferenceLoaded={ hasSitesSortingPreferenceLoaded }
										showDeletedStatus
									/>
								) }
								{ hasSitesSortingPreferenceLoaded && (
									<>
										{ paginatedSites.length > 0 || isLoading ? (
											<>
												<SitesTable
													isLoading={ isLoading }
													sites={ paginatedSites }
													className={ sitesMarginTable }
												/>
												{ selectedStatus.name === 'deleted' && (
													<div
														style={ {
															display: 'flex',
															alignItems: 'center',
															gap: '8px',
														} }
													>
														<Gridicon icon="info" size={ 18 } />
														<span>
															{ createInterpolateElement(
																__(
																	'These sites will be permanently removed after <strong>30 days.</strong>'
																),
																{ strong: <strong /> }
															) }
														</span>
													</div>
												) }
												{ ( selectedStatus.hiddenCount > 0 || sites.length > perPage ) && (
													<PageBodyBottomContainer>
														<Pagination
															page={ page }
															perPage={ perPage }
															total={ sites.length }
															pageClick={ ( newPage: number ) => {
																handleQueryParamChange( { page: newPage } );
															} }
														/>
														{ selectedStatus.hiddenCount > 0 && (
															<HiddenSitesMessageContainer>
																<HiddenSitesMessage>
																	{ sprintf(
																		/* translators: the `hiddenSitesCount` field will be a number greater than 0 */
																		_n(
																			'%(hiddenSitesCount)d site is hidden from the list. Use search to access it.',
																			'%(hiddenSitesCount)d sites are hidden from the list. Use search to access them.',
																			selectedStatus.hiddenCount
																		),
																		{
																			hiddenSitesCount: selectedStatus.hiddenCount,
																		}
																	) }
																</HiddenSitesMessage>
																<Button
																	href={ addQueryArgs( window.location.href, {
																		'show-hidden': 'true',
																	} ) }
																>
																	{ __( 'Show all' ) }
																</Button>
															</HiddenSitesMessageContainer>
														) }
													</PageBodyBottomContainer>
												) }
											</>
										) : (
											<NoSitesMessage
												status={ selectedStatus.name }
												statusSiteCount={ selectedStatus.count }
											/>
										) }
									</>
								) }
							</>
						);
					} }
				</SitesDashboardSitesList>
			</PageBodyWrapper>
			<ScrollButton
				onClick={ scrollToTop }
				visible={ isButtonVisible }
				title={ __( 'Scroll to top' ) }
				aria-label={ __( 'Scroll to top' ) }
			>
				<Gridicon icon="arrow-up" size={ 18 } />
			</ScrollButton>
		</main>
	);
}

function useShowSiteCreationNotice( allSites: SiteExcerptData[], newSiteID: number | undefined ) {
	const { __ } = useI18n();
	const dispatch = useDispatch();
	const shownSiteCreationNotice = useRef( false );

	useEffect( () => {
		if ( shownSiteCreationNotice.current || ! newSiteID ) {
			return;
		}

		const site = allSites.find( ( { ID } ) => ID === newSiteID );
		if ( ! site ) {
			return;
		}

		shownSiteCreationNotice.current = true;

		dispatch(
			successNotice(
				createInterpolateElement(
					/* translators: siteURL is the URL name of a newly created site, excluding the "http://" */
					sprintf( __( 'New site <strong>%(siteURL)s</strong> created.' ), {
						siteURL: withoutHttp( site.URL ),
					} ),
					{ strong: <strong /> }
				),
				{ duration: 8000 }
			)
		);

		// Remove query param without triggering a re-render
		const newUrl = new URL( window.location.href );
		newUrl.searchParams.delete( 'new-site' );
		window.history.replaceState( null, '', newUrl.toString() );
	}, [ __, allSites, dispatch, newSiteID ] );
}

function useShowSiteTransferredNotice() {
	const { __ } = useI18n();
	const dispatch = useDispatch();
	useEffect( () => {
		const url = new URL( window.location.href );
		if ( url.searchParams.get( 'site-transfer-confirm' ) === 'true' ) {
			dispatch( successNotice( __( 'Your site transfer succeeded!' ), { duration: 8000 } ) );

			// Remove query param without triggering a re-render
			url.searchParams.delete( 'site-transfer-confirm' );
			window.history.replaceState( null, '', url.toString() );
		}
	}, [ __, dispatch ] );
}
