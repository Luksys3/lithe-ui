import { Component, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

import { IOnSearchChange } from './IOnSearchChange';

@Component({
	tag: 'lui-search-box'
})
export class SearchBox {
	@Prop() identifier!: string;
	@Prop() placeholder = 'Search...';
	@Prop() delay = 0;

	@Event() onSearchChange!: EventEmitter<IOnSearchChange>;

	private _input!: HTMLInputElement;

	@Method()
	async focusInput() {
		this._input.focus();
	}

	private handleOnChange(value: string) {
		this.onSearchChange.emit({ identifier: this.identifier, value });
	}

	render() {
		return (
			<Host class="relative block h-10">
				<input
					ref={node => {
						if (node !== undefined) {
							this._input = node;
						}
					}}
					class="w-full h-full pl-2 pr-8 py-2 bg-white text-sm rounded border border-gray-300 text-gray-800 outline-none"
					type="text"
					placeholder={this.placeholder}
					onInput={(event: Event) =>
						this.handleOnChange((event as any).target.value)
					}
				/>

				<div class="absolute top-0 right-0 h-full pr-2 flex">
					<img
						class="w-5 m-auto"
						src="/assets/images/search-icon.png"
						alt=""
					/>
				</div>
			</Host>
		);
	}
}
