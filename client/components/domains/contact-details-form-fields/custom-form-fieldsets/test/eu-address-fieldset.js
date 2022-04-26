/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import EuAddressFieldset from '../eu-address-fieldset';

jest.mock( 'i18n-calypso', () => ( {
	localize: ( x ) => x,
	translate: ( x ) => x,
	useTranslate: () => ( x ) => x,
} ) );

describe( 'EU Address Fieldset', () => {
	const defaultProps = {
		getFieldProps: ( name ) => ( { name, value: '' } ),
		translate: ( string ) => string,
	};

	const propsWithoutPostalCode = {
		...defaultProps,
		arePostalCodesSupported: false,
	};

	test( 'should render correctly with default props', () => {
		const { container } = render( <EuAddressFieldset { ...defaultProps } /> );
		expect( container.getElementsByClassName( 'eu-address-fieldset' ) ).toHaveLength( 1 );
	} );

	test( 'should render expected input components', () => {
		render( <EuAddressFieldset { ...defaultProps } /> );
		expect( screen.queryByLabelText( 'City' ) ).toBeDefined();
		expect( screen.queryByLabelText( 'Postal Code' ) ).toBeDefined();
	} );

	test( 'should not render a state select components', () => {
		render( <EuAddressFieldset { ...defaultProps } /> );
		expect( screen.queryByLabelText( 'State' ) ).toBeNull();
	} );

	test( 'should render all expected input components but postal code', () => {
		render( <EuAddressFieldset { ...propsWithoutPostalCode } /> );
		expect( screen.queryByLabelText( 'City' ) ).toBeDefined();
		expect( screen.queryByLabelText( 'Postal Code' ) ).toBeNull();
	} );
} );
