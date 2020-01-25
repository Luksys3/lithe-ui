import { Component, Host, Prop, h } from '@stencil/core';

import { LoadingIcon } from '../helpers/LoadingIcon';

@Component({
	tag: 'lui-chat-message',
	styleUrls: ['../helpers/LoadingIcon.style.css']
})
export class ChatMessage {
	@Prop() me = false;
	@Prop() time = '';
	@Prop() sending = false;

	render() {
		return (
			<Host class="flex px-2 pb-3">
				{this.me && <div class="flex-1" />}

				<div class="flex">
					<div class={`mt-auto ${this.me ? 'text-right' : ''}`}>
						<div
							class={`px-2 py-1 text-xs rounded-lg ${
								this.me
									? 'bg-gray-600 text-white'
									: 'bg-gray-100 text-gray-800'
							} ${this.sending ? 'opacity-50' : ''}`}
						>
							<slot />
						</div>
						<div
							class="flex text-xs mx-1 text-gray-600 justify-end"
							style={{ fontSize: '.65rem' }}
						>
							{this.sending && (
								<div
									class="w-3 h-3 mr-1 opacity-75 rounded-full bg-gray-300"
									style={{ marginTop: '1px', marginRight: '2px' }}
								>
									<LoadingIcon size={3} />
								</div>
							)}

							{this.time}
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
