import { __experimentalText as Text } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCoreSitesPluginsQuery } from 'calypso/data/plugins/use-core-sites-plugins-query';
import { useSiteExcerptsQuery } from 'calypso/data/sites/use-site-excerpts-query';
import { ScheduleFormFrequency } from '../plugins-scheduled-updates/schedule-form-frequency';
import { ScheduleFormPlugins } from '../plugins-scheduled-updates/schedule-form-plugins';
import { validateSites, validatePlugins } from '../plugins-scheduled-updates/schedule-form.helper';
import { ScheduleFormSites } from './schedule-form-sites';

export const ScheduleForm = () => {
	const translate = useTranslate();

	const [ selectedSites, setSelectedSites ] = useState< number[] >( [] );
	const [ selectedPlugins, setSelectedPlugins ] = useState< string[] >( [] );
	const [ validationErrors, setValidationErrors ] = useState< Record< string, string > >( {} );
	const [ fieldTouched, setFieldTouched ] = useState< Record< string, boolean > >( {} );

	const { data: sites } = useSiteExcerptsQuery( [ 'atomic' ] );
	const {
		data: plugins,
		isInitialLoading: isPluginsFetching,
		isFetchedAfterMount: isPluginsFetched,
	} = useCoreSitesPluginsQuery( selectedSites, true, true );

	const prevPlugins = useRef( plugins );

	const getPlugins = useCallback( () => {
		// There is a case when the selectedSites updated but the plugins are not fetched yet
		// In this case plugins will be undefined, so we need to keep the previous plugins
		if ( selectedSites.length && plugins === undefined ) {
			return prevPlugins.current;
		}
		return plugins;
	}, [ plugins, selectedSites ] );

	// Sites selection validation
	useEffect(
		() =>
			setValidationErrors( {
				...validationErrors,
				sites: validateSites( selectedSites ),
			} ),
		[ selectedSites ]
	);

	// Sites selection validation
	useEffect(
		() =>
			setValidationErrors( {
				...validationErrors,
				plugins: validatePlugins( selectedPlugins ),
			} ),
		[ selectedPlugins ]
	);

	useEffect( () => {
		if ( selectedSites.length && plugins !== undefined ) {
			prevPlugins.current = plugins;
		}
	}, [ plugins ] );

	return (
		<div className="schedule-form">
			<Text>{ translate( 'Step 1' ) }</Text>
			<ScheduleFormSites
				sites={ sites }
				onChange={ setSelectedSites }
				onTouch={ ( touched ) => setFieldTouched( { ...fieldTouched, sites: touched } ) }
				error={ validationErrors?.sites }
				showError={ fieldTouched?.sites }
			/>

			<Text>{ translate( 'Step 2' ) }</Text>
			<ScheduleFormPlugins
				plugins={ getPlugins() }
				selectedPlugins={ selectedPlugins }
				isPluginsFetching={ isPluginsFetching }
				isPluginsFetched={ isPluginsFetched }
				onChange={ setSelectedPlugins }
				onTouch={ ( touched ) => setFieldTouched( { ...fieldTouched, plugins: touched } ) }
				error={ validationErrors?.plugins }
				showError={ fieldTouched?.plugins }
			/>

			<Text>{ translate( 'Step 3' ) }</Text>
			<ScheduleFormFrequency initFrequency="daily" />
		</div>
	);
};
