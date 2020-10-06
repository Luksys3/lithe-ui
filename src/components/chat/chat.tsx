import {
	Component,
	Element,
	Event,
	EventEmitter,
	Host,
	Method,
	Prop,
	State,
	h
} from '@stencil/core';

import { Typing } from './helpers/Typing';

@Component({
	tag: 'lui-chat',
	assetsDirs: ['assets']
})
export class Chat {
	@Prop() activeText = '';
	@Prop() inputPlaceholder = 'Your message here...';
	@Prop() inputValue = '';
	@Prop() minimized = false;
	@Prop() typing = false;
	@Prop() typingImage = 'typing.gif';

	@State() _minimized = false;

	@Event() onClose!: EventEmitter;
	@Event() onMinimize!: EventEmitter;
	@Event() onMaximize!: EventEmitter;
	@Event() onTyping!: EventEmitter;
	@Event() onSendMessage!: EventEmitter<{ message: string; success: () => void }>;

	@Element() element!: HTMLLuiChatElement;

	private _initialized = false;
	private _previousMessagesScrollHeight = 0;
	private _messagesElement!: HTMLElement;
	private _closeButtonElement!: HTMLElement;
	private _inputElement!: HTMLInputElement;
	private _observer!: MutationObserver;

	componentWillLoad() {
		this._minimized = this.minimized;
	}

	componentDidLoad() {
		this._observer = new MutationObserver(() => {
			this.handleDOMChange();
		});
		this._observer.observe(this._messagesElement!, {
			childList: true,
			subtree: true
		});

		this.scrollToBottom();
		this._initialized = true;

		this._previousMessagesScrollHeight = this._messagesElement.scrollHeight;
	}

	componentDidRender() {
		if (this._initialized && (this._messagesElement as any) !== null) {
			this.scrollToBottom();
		}
	}

	componentDidUnload() {
		this._observer.disconnect();
	}

	@Method()
	async minimize() {
		this._minimized = true;

		requestAnimationFrame(() => {
			this.onMinimize.emit();
		});
	}

	@Method()
	async maximize() {
		this._minimized = false;

		requestAnimationFrame(() => {
			this.onMaximize.emit();
		});
	}

	@Method()
	async focusInput() {
		if (!this._minimized) {
			this._inputElement.focus();
			return;
		}

		await this.maximize();
		requestAnimationFrame(() => {
			this._inputElement.focus();
		});
	}

	private handleDOMChange() {
		if ((this._messagesElement as any) === null) {
			return;
		}

		if (
			this._messagesElement.scrollHeight -
				(this._messagesElement.clientHeight + this._messagesElement.scrollTop) -
				(this._messagesElement.scrollHeight -
					this._previousMessagesScrollHeight) <
			20
		) {
			this.scrollToBottom();
		}
	}

	private handleHeaderClick(event: Event) {
		if (this._closeButtonElement === event.target) {
			this.onClose.emit();
			return;
		}

		this._minimized = !this._minimized;
		if (this._minimized) {
			this.onMinimize.emit();
		} else {
			this.onMaximize.emit();
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			this.sendMessage();
		}
	}

	private sendMessage() {
		if (this._inputElement.value === '') {
			return;
		}

		this.onSendMessage.emit({
			message: this._inputElement.value,
			success: () => {
				this._inputElement.value = '';
			}
		});
	}

	private scrollToBottom() {
		this._messagesElement.scrollTo(0, this._messagesElement.scrollHeight);
	}

	render() {
		const header = (
			<div
				class={{
					'flex items-center bg-white p-2 rounded-t-lg border-gray-300 hover:bg-gray-100 cursor-pointer': true,
					'shadow-md': this._minimized,
					'border-b': !this._minimized
				}}
				onClick={event => this.handleHeaderClick(event)}
			>
				<slot name="start-header" />
				<div>
					<slot name="image" />
				</div>
				<div class="flex-1 pl-2 pr-3 leading-tight truncate">
					<div class="text-gray-700 text-sm truncate">
						<slot name="name" />
					</div>
					<div class="text-gray-600 text-xs">
						<slot name="status" />
					</div>
				</div>
				<div
					ref={node => {
						if (node !== undefined) {
							this._closeButtonElement = node;
						}
					}}
					class="h-full px-2 text-gray-700 font-medium text-xl cursor-pointer hover:opacity-75 leading-none"
				>
					&times;
				</div>
				<slot name="end-header" />
			</div>
		);

		const content = [
			<div
				ref={node => {
					if (node !== undefined) {
						this._messagesElement = node;
					}
				}}
				class="pt-2 border-b border-gray-300 h-64 overflow-y-auto"
			>
				<slot />

				{this.typing && (
					<lui-chat-message key="typing">
						<Typing
							style={{
								height: '18px',
								padding: '5px 3px'
							}}
						/>
					</lui-chat-message>
				)}
			</div>,

			<div class="flex items-center">
				<slot name="start-input" />
				<svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M17 5v12c0 2.757-2.243 5-5 5s-5-2.243-5-5v-12c0-1.654 1.346-3 3-3s3 1.346 3 3v9c0 .551-.449 1-1 1s-1-.449-1-1v-8h-2v8c0 1.657 1.343 3 3 3s3-1.343 3-3v-9c0-2.761-2.239-5-5-5s-5 2.239-5 5v12c0 3.866 3.134 7 7 7s7-3.134 7-7v-12h-2z" />
				</svg>
				<input
					ref={node => {
						if (node !== undefined) {
							this._inputElement = node;
						}
					}}
					class="flex-1 px-3 py-2 self-center outline-none text-sm"
					type="text"
					placeholder={this.inputPlaceholder}
					value={this.inputValue}
					onKeyUp={(event: KeyboardEvent) => this.handleKeyUp(event)}
					onChange={() => this.onTyping.emit()}
				/>
				<div
					class="h-full px-2 cursor-pointer text-gray-500 hover:text-gray-600"
					onClick={() => this.sendMessage()}
				>
					<svg
						class="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<slot name="end-input" />
			</div>
		];

		return (
			<Host
				class={{
					'flex flex-col mt-auto rounded-t-lg bg-white shadow-md': true,
					'w-full': !this._minimized
				}}
				style={{
					minWidth: this._minimized ? 'auto' : '260px',
					maxWidth: '260px'
				}}
			>
				{header}

				<div class={this._minimized ? 'hidden' : ''}>{content}</div>
			</Host>
		);
	}
}
