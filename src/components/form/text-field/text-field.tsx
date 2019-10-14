import {
	Component,
	Event,
	EventEmitter,
	Host,
	Prop,
	State,
	Watch,
	h
} from '@stencil/core';

import { BaseField } from '../helpers/BaseField';
import { IOnChange } from '../helpers/IOnChange';

@Component({
	tag: 'lui-text-field'
})
export class TextField {
	@Prop() identifier!: string;
	@Prop() placeholder!: string;
	@Prop() required = true;
	@Prop() blocked = false;
	@Prop() type = 'text';
	@Prop() value = '';

	@State() _value!: string;
	@State() _focused = false;

	@Event() onChange!: EventEmitter<IOnChange>;

	@Watch('value')
	handleValueChange(value: string, oldValue: string) {
		if (value !== oldValue) {
			this.handleChange(this.value);
		}
	}

	componentWillLoad() {
		this.handleChange(this.value);
	}

	private handleChange(value: string) {
		this._value = value;

		this.onChange.emit({
			identifier: this.identifier,
			value: this._value
		});
	}

	render() {
		return (
			<Host class="block">
				<BaseField
					placeholder={this.placeholder}
					focused={this._focused || this._value !== ''}
					blocked={this.blocked}
				>
					<input
						class="w-full h-full relative outline-none pl-5 pt-3 text-gray-800 bg-transparent text-sm z-10"
						required={this.required}
						type={this.type}
						value={this._value}
						onFocus={() => (this._focused = true)}
						onBlur={() => (this._focused = false)}
						onInput={(event: Event) => {
							if (event !== null) {
								this.handleChange((event as any).target.value);
							}
						}}
					/>
				</BaseField>
			</Host>
		);
	}
}
