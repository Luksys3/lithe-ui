import {
	Component,
	h,
	Prop,
	State,
	Host,
	Event,
	EventEmitter,
	Watch,
	Listen
} from '@stencil/core';
import { BaseField } from '../helpers/BaseField';
import { IOnChange } from '../helpers/IOnChange';

@Component({
	tag: 'lui-datepicker-field'
})
export class DatepickerField {
	@Prop() identifier!: string;
	@Prop() placeholder!: string;
	@Prop() required = true;
	@Prop() value: string = '';

	@State() _value!: string;

	@Event() onChange!: EventEmitter<IOnChange>;

	@Watch('value')
	handleValueChange(value: string, oldValue: string) {
		if (value !== oldValue) {
			this.handleChange(this.value);
		}
	}

	@Listen('onSelect')
	handleOnSelect(
		event: CustomEvent<{ formattedDate: string; date: Date; inst: object }>
	) {
		event.stopPropagation();
		this.handleChange(event.detail.formattedDate);
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
				<BaseField placeholder={this.placeholder} focused={this._value !== ''}>
					<air-datepicker
						autoClose={true}
						dateFormat="yyyy-mm-dd"
						view="years"
					>
						<input
							class="w-full h-full relative outline-none pl-5 pt-3 text-gray-800 bg-transparent text-sm z-10"
							required={this.required}
							type="text"
							value={this._value}
							readOnly={true}
						/>
					</air-datepicker>
				</BaseField>

				<div class="relative w-full h-0 overflow-hidden">
					<input
						class="absolute left-0 bottom-0 w-full"
						required={this.required && this._value === ''}
						type="text"
						tabIndex={-1}
						onFocus={event => {
							if (event.target !== null) {
								(event.target as HTMLElement).blur();
							}
						}}
					/>
				</div>
			</Host>
		);
	}
}
