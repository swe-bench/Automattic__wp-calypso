import { isEnabled } from '@automattic/calypso-config';
import { useMemo } from 'react';
import { PATTERN_CATEGORIES } from '../constants';
import type { Pattern, Category } from '../types';

const usePatternsMapByCategory = ( patterns: Pattern[], categories: Category[] ) => {
	return useMemo( () => {
		const categoriesMap: Record< string, Pattern[] > = {};

		patterns.forEach( ( pattern ) => {
			// Filter pattern with the meta assembler_waitlist because of rendering issues
			if (
				pattern.pattern_meta?.assembler_waitlist &&
				! isEnabled( 'pattern-assembler/show-waitlist-patterns' )
			) {
				return;
			}
			Object.keys( pattern.categories ).forEach( ( category ) => {
				if ( ! PATTERN_CATEGORIES.includes( category ) ) {
					// Only show allowed categories
					return;
				}
				if ( ! categoriesMap[ category ] ) {
					categoriesMap[ category ] = [];
				}
				categoriesMap[ category ].push( pattern );
			} );
		} );
		return categoriesMap;
	}, [ patterns, categories ] );
};

export default usePatternsMapByCategory;
