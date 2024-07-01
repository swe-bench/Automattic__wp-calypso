import { Button } from '@automattic/components';
import { localizeUrl } from '@automattic/i18n-utils';
import { CheckboxControl, Modal } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import FormField from 'calypso/a8c-for-agencies/components/form/field';
import FormFieldset from 'calypso/components/forms/form-fieldset';
import FormSelect from 'calypso/components/forms/form-select';
import FormTextInputWithAffixes from 'calypso/components/forms/form-text-input-with-affixes';
import { useDataCenterOptions } from 'calypso/data/data-center/use-data-center-options';
import { usePhpVersions } from 'calypso/data/php-versions/use-php-versions';

import './style.scss';

type SiteConfigurationsModalProps = {
	toggleModal: () => void;
};

export default function SiteConfigurationsModal( { toggleModal }: SiteConfigurationsModalProps ) {
	const [ allowClientsToUseSiteHelpCenter, setAllowClientsToUseSiteHelpCenter ] = useState( true );
	const translate = useTranslate();
	const dataCenterOptions = useDataCenterOptions();
	const { phpVersions } = usePhpVersions();

	const toggleAllowClientsToUseSiteHelpCenter = () =>
		setAllowClientsToUseSiteHelpCenter( ! allowClientsToUseSiteHelpCenter );

	const phpVersionsElements = phpVersions.map( ( version ) => {
		if ( version.disabled ) {
			return null;
		}

		return (
			<option value={ version.value } key={ version.value }>
				{ version.label }
			</option>
		);
	} );

	const dataCenterOptionsElements = (
		Object.keys( dataCenterOptions ) as Array< keyof typeof dataCenterOptions >
	 ).map( ( key ) => (
		<option key={ key } value={ key }>
			{ dataCenterOptions[ key ] }
		</option>
	) );

	return (
		<Modal
			title={ translate( 'Configure your site' ) }
			onRequestClose={ toggleModal }
			className="configure-your-site-modal-form"
		>
			<FormFieldset className="configure-your-site-modal-form__main">
				<FormField
					label={ translate( 'Site address' ) }
					description={ translate(
						'Once the site is created, you can connect a custom domain to your site and make that your site address instead.'
					) }
				>
					<FormTextInputWithAffixes suffix=".wpcomstaging.com" noWrap />
				</FormField>
				<FormField
					label={ translate( 'PHP Version' ) }
					description={ translate(
						'The PHP version can be changed after your site is created via {{a}}Web Server Settings{{/a}}.',
						{
							components: {
								a: (
									<a href="https://developer.wordpress.com/docs/developer-tools/web-server-settings/" />
								),
							},
						}
					) }
				>
					<FormSelect
						className="configure-your-site-modal-form__php-version-select"
						name="product"
						onChange={ () => {} }
					>
						{ phpVersionsElements }
					</FormSelect>
				</FormField>
				<FormField label={ translate( 'Primary Data Center' ) }>
					<FormSelect name="product" id="product" onChange={ () => {} }>
						{ dataCenterOptionsElements }
					</FormSelect>
				</FormField>
				<FormField label="">
					<div className="configure-your-site-modal-form__allow-clients-to-use-help-center">
						<CheckboxControl
							id="configure-your-site-modal-form__allow-clients-to-use-help-center-checkbox"
							onChange={ toggleAllowClientsToUseSiteHelpCenter }
							checked={ allowClientsToUseSiteHelpCenter }
						/>
						<label htmlFor="configure-your-site-modal-form__allow-clients-to-use-help-center-checkbox">
							{ translate(
								'Allow clients to use the {{HcLink}}WordPress.com Help Center{{/HcLink}} and {{HfLink}}hosting features.{{/HfLink}}',
								{
									components: {
										HcLink: (
											<a
												href={ localizeUrl(
													'https://developer.wordpress.com/docs/developer-tools/web-server-settings/'
												) }
											/>
										),
										HfLink: (
											<a
												href={ localizeUrl(
													'https://wordpress.com/support/hosting-configuration'
												) }
											/>
										),
									},
								}
							) }
						</label>
					</div>
				</FormField>
			</FormFieldset>
			<div className="configure-your-site-modal-form__footer">
				<Button primary onClick={ () => {} }>
					{ translate( 'Create site' ) }
				</Button>
			</div>
		</Modal>
	);
}
