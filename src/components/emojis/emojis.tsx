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

import { emojiList } from './helpers/emojiList';
import { insertAtCursor } from './helpers/insertAtCusror';

@Component({
	tag: 'lui-emojis'
})
export class Emojis {
	@Prop() input: HTMLTextAreaElement | HTMLInputElement | null = null;

	@State() _open = false;

	@Event() onEmojiClick!: EventEmitter<string>;

	@Element() element!: HTMLLuiEmojisElement;

	componentWillLoad() {
		document.addEventListener('mousedown', event => this.handleClickOutside(event));
	}

	componentDidUnload() {
		document.removeEventListener('mousedown', event =>
			this.handleClickOutside(event)
		);
	}

	@Method()
	async open() {
		this._open = true;
	}

	@Method()
	async close() {
		this._open = false;
	}

	private handleClickOutside(event: MouseEvent) {
		if (!this.element.contains((event as any).target)) {
			this._open = false;
		}
	}

	private handleClick(emoji: string) {
		if (this.input !== null) {
			this.input.focus();
			insertAtCursor(this.input, emoji);
		}

		this.onEmojiClick.emit(emoji);
	}

	render() {
		const modal = (
			<div
				key="modal"
				class="absolute right-0 bottom-0 z-10 h-56 p-1 bg-white border-gray-300 rounded select-none overflow-y-auto shadow-md"
				onMouseDown={event => event.preventDefault()}
			>
				<div style={{ width: '186px' }}>
					{emojiList.map(emoji => (
						<div
							class="inline-block text-center rounded cursor-pointer text-xl hover:bg-gray-300"
							style={{
								width: '31px',
								height: '31px',
								lineHeight: '31px'
							}}
							onClick={() => this.handleClick(emoji)}
						>
							{emoji}
						</div>
					))}
				</div>
			</div>
		);

		return (
			<Host class="relative">
				{this._open && modal}

				<div
					onMouseDown={event => {
						event.preventDefault();
						this._open = !this._open;
					}}
				>
					<slot />
				</div>
			</Host>
		);
	}
}
