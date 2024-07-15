import { forwardRef, WheelEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ChatMessage, { ChatMessageProps } from './components/message';
import { OdieSendMessageButton } from './components/send-message-input';
import { useOdieAssistantContext, OdieAssistantProvider } from './context';
import { SupportMessenger, useSupportMessenger } from './context/messenger';

import './style.scss';

export const ODIE_THUMBS_DOWN_RATING_VALUE = 0;
export const ODIE_THUMBS_UP_RATING_VALUE = 1;

const ForwardedChatMessage = forwardRef< HTMLDivElement, ChatMessageProps >( ChatMessage );

export const OdieAssistantComponent: React.FC = () => {
	const { chat, trackEvent, currentUser } = useOdieAssistantContext();
	const { conversations, isLoading } = useSupportMessenger();
	const chatboxMessagesRef = useRef< HTMLDivElement | null >( null );
	const { ref: bottomRef, entry: lastMessageElement, inView } = useInView( { threshold: 0 } );
	const [ stickToBottom, setStickToBottom ] = useState( true );
	const scrollToBottom = useCallback(
		( force = false ) => {
			if ( force || stickToBottom ) {
				requestAnimationFrame( () => {
					if ( lastMessageElement?.target ) {
						lastMessageElement.target.scrollIntoView( {
							behavior: 'auto',
							block: 'end',
							inline: 'nearest',
						} );
					}
				} );
			}
		},
		[ lastMessageElement?.target, stickToBottom ]
	);

	useEffect( () => {
		trackEvent( 'chatbox_view' );
	}, [ trackEvent ] );

	const scrollToInitialBlockOfLastMessage = useCallback( () => {
		if ( chatboxMessagesRef.current ) {
			requestAnimationFrame( () => {
				if ( lastMessageElement?.target ) {
					lastMessageElement?.target.scrollIntoView( {
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					} );
				}
			} );
		}
	}, [ lastMessageElement?.target ] );

	useEffect( () => {
		scrollToInitialBlockOfLastMessage();
	}, [ chat.messages.length, scrollToInitialBlockOfLastMessage ] );

	return (
		<div className="chatbox">
			<div className="chat-box-message-container">
				<div
					className="chatbox-messages"
					ref={ chatboxMessagesRef }
					onWheel={ ( event: WheelEvent< HTMLDivElement > ) => {
						// If delta is negative, we are scrolling up so we want to disable stick to bottom
						// we might improve this in the future for touch devices
						if ( event.deltaY < 0 ) {
							setStickToBottom( false );
						} else if ( chatboxMessagesRef.current ) {
							const scrollHeight = chatboxMessagesRef.current.scrollHeight;
							const scrollTop = chatboxMessagesRef.current.scrollTop;
							const clientHeight = chatboxMessagesRef.current.clientHeight;
							const scrollBottom = scrollHeight - scrollTop - clientHeight;
							setStickToBottom( scrollBottom < 8 );
						}
					} }
				>
					{ isLoading ? (
						'Loading'
					) : (
						<>
							{ chat.messages.map( ( message, index ) => {
								return (
									<ForwardedChatMessage
										message={ message }
										key={ index }
										currentUser={ currentUser }
										scrollToBottom={ scrollToBottom }
										ref={
											conversations.length === 0 && chat.messages.length - 1 === index
												? bottomRef
												: undefined
										}
									/>
								);
							} ) }
							{ conversations.map( ( message, index ) => {
								return (
									<ForwardedChatMessage
										message={ message }
										key={ chat.messages.length + index }
										currentUser={ currentUser }
										scrollToBottom={ scrollToBottom }
										ref={ conversations.length - 1 === index ? bottomRef : undefined }
									/>
								);
							} ) }
						</>
					) }
				</div>
				<OdieSendMessageButton
					scrollToBottom={ scrollToBottom }
					scrollToRecent={ scrollToInitialBlockOfLastMessage }
					enableStickToBottom={ () => setStickToBottom( true ) }
					enableJumpToRecent={ ! inView }
				/>
			</div>
		</div>
	);
};

export const OdieAssistant: React.FC = () => {
	return (
		<SupportMessenger>
			<OdieAssistantComponent />
		</SupportMessenger>
	);
};

export default OdieAssistantProvider;
export { useOdieAssistantContext } from './context';
export { useSetOdieStorage, useGetOdieStorage } from './data';
export { EllipsisMenu } from './components/ellipsis-menu';
