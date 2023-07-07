import { Button } from '@automattic/components';
import { NavigatorHeader } from '@automattic/onboarding';
import {
	__experimentalNavigatorBackButton as NavigatorBackButton,
	__unstableComposite as Composite,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { Icon, chevronRight } from '@wordpress/icons';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { useState, useEffect } from 'react';
import { PATTERN_ASSEMBLER_EVENTS } from './events';
import useCategoriesOrder from './hooks/use-categories-order';
import NavigatorTitle from './navigator-title';
import PatternListPanel from './pattern-list-panel';
import { replaceCategoryAllName } from './utils';
import type { Pattern, Category } from './types';
import './screen-category-list.scss';

interface Props {
	categories: Category[];
	patternsMapByCategory: { [ key: string ]: Pattern[] };
	onDoneClick: () => void;
	onSelect: (
		type: string,
		selectedPattern: Pattern | null,
		selectedCategory: string | null
	) => void;
	replacePatternMode: boolean;
	selectedPattern: Pattern | null;
	selectedPatterns: Pattern[];
	recordTracksEvent: ( name: string, eventProperties: any ) => void;
	onTogglePatternPanelList?: ( isOpen: boolean ) => void;
	onBack: () => void;
}

const ScreenCategoryList = ( {
	patternsMapByCategory,
	categories,
	onDoneClick,
	replacePatternMode,
	onSelect,
	selectedPattern,
	selectedPatterns,
	recordTracksEvent,
	onTogglePatternPanelList,
	onBack,
}: Props ) => {
	const translate = useTranslate();
	const firstCategory = categories[ 0 ];
	const [ selectedCategory, setSelectedCategory ] = useState< string | null >( null );
	const categoriesInOrder = useCategoriesOrder( categories );
	const composite = useCompositeState( { orientation: 'vertical' } );

	const trackEventCategoryClick = ( name: string ) => {
		recordTracksEvent( PATTERN_ASSEMBLER_EVENTS.SCREEN_CATEGORY_LIST_CATEGORY_CLICK, {
			pattern_category: replaceCategoryAllName( name ),
		} );
	};

	useEffect( () => {
		// Open first category with a delay to avoid the top position flickering
		setTimeout( () => setSelectedCategory( firstCategory?.name ?? null ), 200 );

		// Notify the pattern panel list is open and closed
		onTogglePatternPanelList?.( true );
		return () => {
			onTogglePatternPanelList?.( false );
		};
	}, [] );

	return (
		<div className="screen-container">
			<NavigatorHeader
				title={
					<NavigatorTitle
						title={
							replacePatternMode ? translate( 'Replace section' ) : translate( 'Add sections' )
						}
					/>
				}
				description={
					replacePatternMode
						? translate(
								'Replace the selected pattern by choosing from the list of categories below.'
						  )
						: translate(
								'Find the right patterns for your homepage by exploring the pattern categories below.'
						  )
				}
				onBack={ onBack }
			/>
			<Composite
				{ ...composite }
				role="listbox"
				className="screen-container__body screen-category-list__body"
				aria-label={ translate( 'Block pattern categories' ) }
			>
				{ categoriesInOrder.map( ( { name, label, description } ) => {
					const isOpen = selectedCategory === name;
					const hasPatterns = name && patternsMapByCategory[ name ]?.length;
					const isHeaderCategory = name === 'header';
					const isFooterCategory = name === 'footer';

					if ( ! hasPatterns || isHeaderCategory || isFooterCategory ) {
						return null;
					}

					return (
						<CompositeItem
							key={ name }
							role="option"
							as="button"
							{ ...composite }
							className={ classNames(
								'components-navigator-button',
								'navigator-button',
								'screen-category-list__category-button',
								{
									'navigator-button--is-active': isOpen,
								}
							) }
							aria-label={ label }
							aria-describedby={ description }
							aria-current={ isOpen }
							onClick={ () => {
								if ( isOpen ) {
									onTogglePatternPanelList?.( false );
									setSelectedCategory( null );
								} else {
									onTogglePatternPanelList?.( true );
									setSelectedCategory( name );
									trackEventCategoryClick( name );
								}
							} }
						>
							<span>{ label }</span>
							<Icon
								className="screen-category-list__arrow-icon"
								icon={ chevronRight }
								size={ 24 }
							/>
						</CompositeItem>
					);
				} ) }
			</Composite>
			<div className="screen-container__footer">
				<NavigatorBackButton
					as={ Button }
					className="pattern-assembler__button"
					primary
					onClick={ () => {
						onDoneClick();
					} }
				>
					{ translate( 'Save' ) }
				</NavigatorBackButton>
			</div>
			<PatternListPanel
				onSelect={ ( selectedPattern: Pattern | null ) =>
					onSelect( 'section', selectedPattern, selectedCategory )
				}
				selectedPattern={ selectedPattern }
				selectedPatterns={ selectedPatterns }
				selectedCategory={ selectedCategory }
				categories={ categories }
				patternsMapByCategory={ patternsMapByCategory }
			/>
		</div>
	);
};

export default ScreenCategoryList;
