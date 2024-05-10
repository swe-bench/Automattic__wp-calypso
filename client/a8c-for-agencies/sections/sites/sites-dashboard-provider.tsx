import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
	DATAVIEWS_TABLE,
	initialDataViewsState,
} from 'calypso/a8c-for-agencies/components/items-dashboard/constants';
import { DataViewsState } from 'calypso/a8c-for-agencies/components/items-dashboard/items-dataviews/interfaces';
import { SitesDashboardContextInterface } from 'calypso/a8c-for-agencies/sections/sites/types';
import {
	DashboardSortInterface,
	Site,
} from 'calypso/jetpack-cloud/sections/agency-dashboard/sites-overview/types';
import { DEFAULT_SORT_DIRECTION, DEFAULT_SORT_FIELD, filtersMap } from './constants';
import SitesDashboardContext from './sites-dashboard-context';
import SiteTag from 'calypso/a8c-for-agencies/types/site-tag';

interface Props {
	showOnlyFavoritesInitialState?: boolean;
	hideListingInitialState?: boolean;
	categoryInitialState?: string;
	siteUrlInitialState?: string;
	siteFeatureInitialState?: string;
	searchQuery: string;
	children: ReactNode;
	path: string;
	filters: {
		status: string;
		siteTags: string;
	};
	currentPage: number;
	sort: DashboardSortInterface;
	featurePreview?: ReactNode | null;
}

const buildFilters = ( { status, siteTags }: { status: string; siteTags: string } ) => {
	const statusArray = status?.split( ',' );

	const statusFilter =
		statusArray?.map( ( issueType ) => {
			return {
				field: 'status',
				operator: 'in',
				value: filtersMap.find( ( filterMap ) => filterMap.filterType === issueType )?.ref || 1,
			};
		} ) || [];

	const siteTagsArray = siteTags?.split( ',' );
	const siteTagsFilter =
		siteTagsArray?.map( ( siteTag: string ) => {
			return {
				field: 'site_tags',
				operator: 'in',
				value:
					[
						{ value: 'game', label: 'Game' },
						{ value: 'retro', label: 'Retro' },
						{ value: 'some', label: 'Some' },
						{ value: 'tags', label: 'Tags' },
					].find( ( tagFilter ) => {
						return tagFilter.value.toLowerCase() === siteTag?.toString().toLowerCase();
					} )?.value || '',
			};
		} ) || [];

	return [ ...statusFilter, ...siteTagsFilter ];
};

export const SitesDashboardProvider = ( {
	hideListingInitialState = false,
	showOnlyFavoritesInitialState = false,
	categoryInitialState,
	siteUrlInitialState,
	siteFeatureInitialState,
	children,
	path,
	searchQuery,
	filters,
	currentPage,
	sort,
	featurePreview,
}: Props ) => {
	const [ hideListing, setHideListing ] = useState( hideListingInitialState );
	const [ selectedCategory, setSelectedCategory ] = useState( categoryInitialState );
	const [ selectedSiteFeature, setSelectedSiteFeature ] = useState( siteFeatureInitialState );
	const [ showOnlyFavorites, setShowOnlyFavorites ] = useState( showOnlyFavoritesInitialState );
	const [ isBulkManagementActive, setIsBulkManagementActive ] = useState( false );
	const [ selectedSites, setSelectedSites ] = useState< Site[] >( [] );
	const [ currentLicenseInfo, setCurrentLicenseInfo ] = useState< string | null >( null );
	const [ mostRecentConnectedSite, setMostRecentConnectedSite ] = useState< string | null >( null );
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );
	const [ initialSelectedSiteUrl, setInitialSelectedSiteUrl ] = useState( siteUrlInitialState );

	const handleSetBulkManagementActive = ( isActive: boolean ) => {
		setIsBulkManagementActive( isActive );
		if ( ! isActive ) {
			setSelectedSites( [] );
		}
	};

	const onShowLicenseInfo = ( license: string ) => {
		setCurrentLicenseInfo( license );
	};

	const onHideLicenseInfo = () => {
		setCurrentLicenseInfo( null );
	};

	/* initialDataViewsState.sort.field = DEFAULT_SORT_FIELD; */
	/* initialDataViewsState.sort.direction = DEFAULT_SORT_DIRECTION; */
	// initialDataViewsState.hiddenFields = [ 'status', 'site_tags' ];

	const dataViewsFilters = useMemo( () => buildFilters( filters ), [ filters ] );

	const [ dataViewsState, setDataViewsState ] = useState< DataViewsState >( {
		...initialDataViewsState,
		page: currentPage,
		search: searchQuery,
		sort,
		filters: dataViewsFilters,
	} );

	useEffect( () => {
		setInitialSelectedSiteUrl( siteUrlInitialState );
		if ( ! siteUrlInitialState ) {
			setShowOnlyFavorites( showOnlyFavoritesInitialState );
			setHideListing( false );
		}

		setDataViewsState( ( previousState ) => ( {
			...previousState,
			...( siteUrlInitialState
				? {}
				: {
						filters: dataViewsFilters,
				  } ),
			...( siteUrlInitialState ? {} : { search: searchQuery } ),
			...( siteUrlInitialState ? {} : { sort } ),
			...( siteUrlInitialState ? {} : { selectedItem: undefined } ),
			...( siteUrlInitialState ? {} : { type: DATAVIEWS_TABLE } ),
		} ) );
	}, [
		setDataViewsState,
		showOnlyFavoritesInitialState,
		searchQuery,
		sort,
		issueTypes,
		siteUrlInitialState,
		setInitialSelectedSiteUrl,
	] );

	const sitesDashboardContextValue: SitesDashboardContextInterface = {
		selectedCategory: selectedCategory,
		setSelectedCategory: setSelectedCategory,
		selectedSiteFeature: selectedSiteFeature,
		setSelectedSiteFeature: setSelectedSiteFeature,
		hideListing: hideListing,
		setHideListing: setHideListing,
		showOnlyFavorites: showOnlyFavorites,
		setShowOnlyFavorites: setShowOnlyFavorites,
		path,
		currentPage,
		isBulkManagementActive,
		initialSelectedSiteUrl: initialSelectedSiteUrl,
		setIsBulkManagementActive: handleSetBulkManagementActive,
		selectedSites,
		setSelectedSites,
		currentLicenseInfo,
		showLicenseInfo: onShowLicenseInfo,
		hideLicenseInfo: onHideLicenseInfo,
		mostRecentConnectedSite,
		setMostRecentConnectedSite,
		isPopoverOpen,
		setIsPopoverOpen,
		dataViewsState,
		setDataViewsState,
		featurePreview,
	};
	return (
		<SitesDashboardContext.Provider value={ sitesDashboardContextValue }>
			{ children }
		</SitesDashboardContext.Provider>
	);
};
