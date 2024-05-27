import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import { Input } from 'calypso/my-sites/domains/components/form';

const noop = () => {};

const EuAddressFieldset = ( {
	getFieldProps = noop,
	arePostalCodesSupported = true,
	translate,
	contactDetailsErrors,
} ) => {
	return (
		<div className="custom-form-fieldsets__address-fields eu-address-fieldset">
			{ arePostalCodesSupported && (
				<Input
					label={ translate( 'Postal Code' ) }
					{ ...getFieldProps( 'postal-code', {
						customErrorMessage: contactDetailsErrors?.postalCode,
					} ) }
				/>
			) }
			<Input
				label={ translate( 'City' ) }
				{ ...getFieldProps( 'city', { customErrorMessage: contactDetailsErrors?.city } ) }
			/>
		</div>
	);
};

EuAddressFieldset.propTypes = {
	getFieldProps: PropTypes.func,
	translate: PropTypes.func,
	contactDetailsErrors: PropTypes.object,
	arePostalCodesSupported: PropTypes.bool,
};

export default localize( EuAddressFieldset );
