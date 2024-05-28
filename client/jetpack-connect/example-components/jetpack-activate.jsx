import { Gridicon } from '@automattic/components';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import FormTextInput from 'calypso/components/forms/form-text-input';

const JetpackConnectExampleActivate = ( { isInstall, url, translate, onClick } ) => {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<div className="example-components__main" onClick={ onClick }>
			<div className="example-components__browser-chrome example-components__site-url-input-container">
				<div className="example-components__browser-chrome-dots">
					<div className="example-components__browser-chrome-dot" />
					<div className="example-components__browser-chrome-dot" />
					<div className="example-components__browser-chrome-dot" />
				</div>
				<div className="example-components__site-address-container">
					<Gridicon size={ 24 } icon="globe" />
					<FormTextInput
						className="example-components__browser-chrome-url"
						disabled
						placeholder={ url }
					/>
				</div>
			</div>
			<div className="example-components__content example-components__activate-jetpack">
				<div className="example-components__content-wp-admin-masterbar" />
				<div className="example-components__content-wp-admin-sidebar" />
				<div className="example-components__content-wp-admin-main">
					{ isInstall ? (
						<div className="example-components__content-wp-admin-activate-view">
							<div className="example-components__content-wp-admin-activate-link" aria-hidden>
								{ translate( 'Activate Plugin', {
									context: 'Jetpack Connect activate plugin instructions, activate link',
								} ) }
							</div>
						</div>
					) : (
						<div className="example-components__content-wp-admin-plugin-card">
							<div className="example-components__content-wp-admin-plugin-name" aria-hidden>
								{ translate( 'Jetpack by WordPress.com', {
									context: 'Jetpack Connect activate plugin instructions, plugin title',
								} ) }
							</div>
							<div
								className="example-components__content-wp-admin-plugin-activate-link"
								aria-hidden
							>
								{ translate( 'Activate', {
									context: 'Jetpack Connect activate plugin instructions, activate link',
								} ) }
							</div>
						</div>
					) }
				</div>
			</div>
		</div>
	);
};

JetpackConnectExampleActivate.propTypes = {
	onClick: PropTypes.func,
};

export default localize( JetpackConnectExampleActivate );
