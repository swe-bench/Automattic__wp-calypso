import { getUrlParts } from '@automattic/calypso-url';
import classNames from 'classnames';
import { localize, translate } from 'i18n-calypso';
import { omitBy } from 'lodash';
import PropTypes from 'prop-types';
import { createElement, PureComponent, createRef } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'calypso/components/tooltip';
import { navigate } from 'calypso/lib/navigate';
import { createAccountUrl } from 'calypso/lib/paths';
import { isUserLoggedIn } from 'calypso/state/current-user/selectors';
import LikeIcons from './icons';
import './style.scss';

class LikeButton extends PureComponent {
	likeRef = createRef();
	state = { tooltip: false };

	static propTypes = {
		liked: PropTypes.bool,
		showZeroCount: PropTypes.bool,
		likeCount: PropTypes.number,
		showLabel: PropTypes.bool,
		tagName: PropTypes.oneOfType( [ PropTypes.string, PropTypes.object ] ),
		onLikeToggle: PropTypes.func,
		likedLabel: PropTypes.string,
		iconSize: PropTypes.number,
		animateLike: PropTypes.bool,
		postId: PropTypes.number,
		slug: PropTypes.string,
		icon: PropTypes.object,
		defaultLabel: PropTypes.string,
	};

	static defaultProps = {
		liked: false,
		showZeroCount: false,
		likeCount: 0,
		showLabel: true,
		iconSize: 24,
		animateLike: true,
		postId: null,
		slug: null,
		icon: null,
		defaultLabel: '',
	};

	constructor( props ) {
		super( props );

		this.toggleLiked = this.toggleLiked.bind( this );
	}

	toggleLiked( event ) {
		if ( ! this.props.isLoggedIn ) {
			const { pathname } = getUrlParts( window.location.href );
			return navigate( createAccountUrl( { redirectTo: pathname, ref: 'reader-lp' } ) );
		}
		if ( event ) {
			event.preventDefault();
		}
		if ( this.props.onLikeToggle ) {
			this.props.onLikeToggle( ! this.props.liked );
		}
	}

	render() {
		const {
			likeCount,
			tagName: containerTag = 'li',
			showZeroCount,
			postId,
			slug,
			onMouseEnter,
			onMouseLeave,
			icon,
			defaultLabel,
		} = this.props;
		const showLikeCount = likeCount > 0 || showZeroCount;
		const isLink = containerTag === 'a';
		const containerClasses = {
			'like-button': true,
			'ignore-click': true,
			'is-mini': this.props.isMini,
			'is-animated': this.props.animateLike,
			'has-count': showLikeCount,
			'has-label': this.props.showLabel,
		};

		if ( this.props.liked ) {
			containerClasses[ 'is-liked' ] = true;
		}

		const labelElement = (
			<span className="like-button__label">
				<span className="like-button__label-count">
					{ showLikeCount ? likeCount : defaultLabel }
				</span>
			</span>
		);

		const tooltipElement = (
			<Tooltip isVisible={ this.state.tooltip } position="bottom" context={ this.likeRef.current }>
				{ this.props.liked ? translate( 'Liked' ) : translate( 'Like' ) }
			</Tooltip>
		);

		const mouseEnter = ( e ) => {
			this.setState( { tooltip: true } );
			return onMouseEnter && onMouseEnter( e );
		};

		const mouseLeave = ( e ) => {
			this.setState( { tooltip: false } );
			return onMouseLeave && onMouseLeave( e );
		};

		const likeIcons = icon || <LikeIcons size={ this.props.iconSize } />;
		const href = isLink ? `/stats/post/${ postId }/${ slug }` : null;
		return createElement(
			containerTag,
			omitBy(
				{
					href,
					className: classNames( containerClasses ),
					onClick: ! isLink ? this.toggleLiked : null,
					onMouseEnter: mouseEnter,
					onMouseLeave: mouseLeave,
					ref: this.likeRef,
				},
				( prop ) => prop === null
			),
			likeIcons,
			labelElement,
			tooltipElement
		);
	}
}

export default connect( ( state ) => ( {
	isLoggedIn: isUserLoggedIn( state ),
} ) )( localize( LikeButton ) );
