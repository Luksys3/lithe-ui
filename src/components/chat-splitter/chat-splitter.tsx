import { Component, Host, h } from '@stencil/core';

@Component({
	tag: 'lui-chat-splitter'
})
export class ChatSplitter {
	render() {
		return (
			<Host class="block pt-3 pb-2 text-xs text-center text-gray-500">
				<slot />
			</Host>
		);
	}
}
