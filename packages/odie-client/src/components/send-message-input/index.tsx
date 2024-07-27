/* eslint-disable no-restricted-imports */
import { Spinner } from '@wordpress/components';
import { useI18n } from '@wordpress/react-i18n';
import React, { useCallback, useState, KeyboardEvent, FormEvent, useRef, useEffect } from 'react';
import TextareaAutosize from 'calypso/components/textarea-autosize';
import ArrowUp from '../../assets/arrow-up.svg';
import { useOdieAssistantContext } from '../../context';
import { useOdieSendMessage } from '../../query';
import { Message } from '../../types/';
import { JumpToRecent } from '../message/jump-to-recent';

import './style.scss';

export const OdieSendMessageButton = ( { scrollToRecent }: { scrollToRecent: () => void } ) => {
	const { _x } = useI18n();
	const [ messageString, setMessageString ] = useState< string >( '' );
	const divContainerRef = useRef< HTMLDivElement >( null );
	const {
		initialUserMessage,
		chat,
		trackEvent,
		isLoading,
		sendMessage: sendHelpCenterMessage,
	} = useOdieAssistantContext();
	const { mutateAsync: sendOdieMessage } = useOdieSendMessage();

	useEffect( () => {
		if ( initialUserMessage && ! chat.chat_id ) {
			setMessageString( initialUserMessage );
		}
	}, [ initialUserMessage, chat.chat_id ] );

	const sendMessage = useCallback( async () => {
		try {
			trackEvent( 'chat_message_action_send' );

			const message = {
				content: messageString,
				role: 'user',
				type: 'message',
			} as Message;

			if ( chat.type === 'human' ) {
				sendHelpCenterMessage( messageString, chat.chat_id );
			} else {
				await sendOdieMessage( { message } );
			}

			trackEvent( 'chat_message_action_receive' );
		} catch ( e ) {
			const error = e as Error;
			trackEvent( 'chat_message_error', {
				error: error?.message,
			} );
		}
	}, [
		chat.chat_id,
		chat.type,
		messageString,
		sendHelpCenterMessage,
		sendOdieMessage,
		trackEvent,
	] );

	const sendMessageIfNotEmpty = useCallback( async () => {
		if ( messageString.trim() === '' ) {
			return;
		}
		setMessageString( '' );
		await sendMessage();
	}, [ messageString, sendMessage ] );

	const handleKeyPress = useCallback(
		async ( event: KeyboardEvent< HTMLTextAreaElement > ) => {
			if ( isLoading ) {
				return;
			}
			if ( event.key === 'Enter' && ! event.shiftKey ) {
				event.preventDefault();
				await sendMessageIfNotEmpty();
			}
		},
		[ isLoading, sendMessageIfNotEmpty ]
	);

	const handleSubmit = useCallback(
		async ( event: FormEvent< HTMLFormElement > ) => {
			event.preventDefault();
			await sendMessageIfNotEmpty();
		},
		[ sendMessageIfNotEmpty ]
	);

	const getPlaceholderText = useCallback( () => {
		const placeholderText = _x(
			'Please wait…',
			'Placeholder text for the message input field (chat)',
			__i18n_text_domain__
		);

		if ( ! isLoading ) {
			return _x(
				'Ask your question',
				'Placeholder text for the message input field (chat)',
				__i18n_text_domain__
			);
		}

		return placeholderText;
	}, [ isLoading, _x ] );

	return (
		<>
			<JumpToRecent scrollToRecent={ scrollToRecent } />
			<div className="odie-chat-message-input-container" ref={ divContainerRef }>
				<form onSubmit={ handleSubmit } className="odie-send-message-input-container">
					<TextareaAutosize
						placeholder={ getPlaceholderText() }
						className="odie-send-message-input"
						rows={ 1 }
						value={ messageString }
						onChange={ ( event: React.ChangeEvent< HTMLTextAreaElement > ) =>
							setMessageString( event.currentTarget.value )
						}
						onKeyPress={ handleKeyPress }
					/>
					{ isLoading && <Spinner className="odie-send-message-input-spinner" /> }
					<button
						type="submit"
						className="odie-send-message-inner-button"
						disabled={ messageString.trim() === '' || isLoading }
					>
						<img src={ ArrowUp } alt={ _x( 'Arrow icon', 'html alt tag', __i18n_text_domain__ ) } />
					</button>
				</form>
			</div>
		</>
	);
};
