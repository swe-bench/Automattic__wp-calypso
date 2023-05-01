import { CountComparisonCard, Popover } from '@automattic/components';
import { Icon, info } from '@wordpress/icons';
import { useTranslate } from 'i18n-calypso';
import { useRef, useState } from 'react';
import './subscribers-highlight-section.scss';

function useSubscriberHighlights() {
	const translate = useTranslate();
	const highlights = [
		{
			heading: translate( 'Total email subscribers' ),
			count: 1410,
			previousCount: 1080,
		},
		{
			heading: translate( 'Free email subscribers' ),
			count: 1340,
			previousCount: 1034,
		},
		{
			heading: translate( 'Paid email subscribers' ),
			count: 70,
			previousCount: 46,
		},
		{
			heading: translate( 'WordPress.com subscribers' ),
			count: 322,
			previousCount: 326,
		},
	];
	return highlights;
}

function BasicSectionHeaderInfoPopover( props ) {
	const [ isTooltipVisible, setTooltipVisible ] = useState( false );
	const infoReferenceElement = useRef( null );
	return (
		<>
			<span
				className="info-wrapper"
				ref={ infoReferenceElement }
				onMouseEnter={ () => setTooltipVisible( true ) }
				onMouseLeave={ () => setTooltipVisible( false ) }
			>
				<Icon className="info-icon" icon={ info } />
			</span>
			<Popover
				className="tooltip tooltip--darker tooltip-wordads highlight-card-tooltip"
				isVisible={ isTooltipVisible }
				position="bottom right"
				context={ infoReferenceElement.current }
			>
				<div className="highlight-card-tooltip-content">{ props.popoverContent }</div>
			</Popover>
		</>
	);
}

function BasicSectionHeader( props ) {
	// Values coming from caller (via props).
	const title = props.title;
	const popoverContent = props.popoverContent;
	const subTitle = props.subTitle;
	const subTitleLink = props.subTitleLink;
	// Set up popover.
	let popover = null;
	if ( popoverContent !== undefined ) {
		popover = <BasicSectionHeaderInfoPopover popoverContent={ popoverContent } />;
	}
	// Do the same for a subtitle with optional link. Should be either/or.
	// Update the JSX as needed.
	return (
		<div className="highlight-cards">
			<h1 className="highlight-cards-heading">
				{ title } { popover }
			</h1>
		</div>
	);
}

function SubscriberHighlightsHeader() {
	const translate = useTranslate();
	const [ isTooltipVisible, setTooltipVisible ] = useState( false );
	const infoReferenceElement = useRef( null );
	const localizedTitle = translate( 'All time stats', {
		comment: 'Heading for Subscribers page highlights section',
	} );
	return (
		<h1 className="highlight-cards-heading">
			{ localizedTitle }{ ' ' }
			<span
				className="info-wrapper"
				ref={ infoReferenceElement }
				onMouseEnter={ () => setTooltipVisible( true ) }
				onMouseLeave={ () => setTooltipVisible( false ) }
			>
				<Icon className="info-icon" icon={ info } />
			</span>
			<Popover
				className="tooltip tooltip--darker tooltip-subscribers-page highlight-card-tooltip"
				isVisible={ isTooltipVisible }
				position="bottom right"
				context={ infoReferenceElement.current }
			>
				<div className="highlight-card-tooltip-content">
					<p>Tooltip content goes here.</p>
				</div>
			</Popover>
		</h1>
	);
}

function SubscriberHighlightsListing() {
	const highlights = useSubscriberHighlights();

	return (
		<div className="highlight-cards-list">
			{ highlights.map( ( highlight ) => (
				<CountComparisonCard
					key={ highlight.heading }
					heading={ highlight.heading }
					count={ highlight.count }
					previousCount={ highlight.previousCount }
					showValueTooltip
				/>
			) ) }
		</div>
	);
}

export default function SubscribersHighlightSection() {
	let popoverContent = <p>Popover content goes here.</p>;
	return (
		<div className="highlight-cards subscribers-page has-odyssey-stats-bg-color">
			<SubscriberHighlightsHeader />
			<SubscriberHighlightsListing />
			<BasicSectionHeader title="New section header" popoverContent={ popoverContent } />
			<BasicSectionHeader title="New section header without popover" />
		</div>
	);
}
