import { Component, Host, Prop, h } from '@stencil/core';

import { LoadingIcon } from '../helpers/LoadingIcon';

@Component({
	tag: 'lui-loader',
	styleUrls: ['../helpers/LoadingIcon.style.css']
})
export class Loader {
	@Prop() position: 'top' | '' = '';

	render() {
		return (
			<Host class="absolute flex inset-0 opacity-50 z-10 bg-white overflow-hidden">
				<LoadingIcon position={this.position} />
			</Host>
		);
	}
}
