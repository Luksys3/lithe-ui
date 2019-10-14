import { Component, Host, Prop, h } from '@stencil/core';

@Component({
	tag: 'lui-loader'
})
export class Loader {
	@Prop() position: 'top' | '' = '';

	render() {
		return (
			<Host class="absolute flex inset-0 opacity-50 z-10 bg-white overflow-hidden">
				<svg
					class={`w-5 h-5 text-black m-auto ${
						this.position === 'top' ? 'mt-24' : ''
					}`}
					viewBox="0 0 24 24"
					style={{
						animation: 'loading-animation 1s linear infinite'
					}}
				>
					<path
						class="fill-current"
						d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"
					/>
				</svg>
			</Host>
		);
	}
}
