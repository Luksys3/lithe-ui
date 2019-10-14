import {
	Component,
	Element,
	Event,
	EventEmitter,
	Host,
	Listen,
	Prop,
	State,
	Watch,
	h
} from '@stencil/core';

import { BaseField } from '../helpers/BaseField';
import { ClearFieldButton } from '../helpers/ClearFieldButton';
import { IOnChange } from '../helpers/IOnChange';
import { IOnSelect } from '../options-container/IOnSelect';

import { IOption } from './IOption';

@Component({
	tag: 'lui-select-field'
})
export class SelectField {
	@Prop() identifier!: string;
	@Prop() placeholder!: string;
	@Prop() options!: IOption[];
	@Prop() required = true;
	@Prop() blocked = false;
	@Prop() showSearch = true;
	@Prop() eventBasedSearch = false;
	@Prop() loading = false;
	@Prop() value: IOption | null = null;
	@Prop() valueIdentifier: IOption['identifier'] | null = null;

	@State() _value!: IOption | null;
	@State() _open = false;

	@Event() onOpen!: EventEmitter;
	@Event() onChange!: EventEmitter<IOnChange>;

	@Element() element!: HTMLLuiSelectFieldElement;

	componentWillLoad() {
		this._value = this.value;
		if (this.valueIdentifier !== null) {
			this._value = this.findOption(this.valueIdentifier);
		}

		document.addEventListener('mousedown', event => this.handleClickOutside(event));
	}

	componentDidUnload() {
		document.removeEventListener('mousedown', event =>
			this.handleClickOutside(event)
		);
	}

	@Watch('value')
	handleValueChange(value: IOption | null, oldValue: IOption | null) {
		if (value !== oldValue || JSON.stringify(value) !== JSON.stringify(oldValue)) {
			this._value = value;
		}
	}

	@Watch('valueIdentifier')
	handleValueIdentifierChange(
		valueIdentifier: string | null,
		oldValueIdentifier: string | null
	) {
		if (valueIdentifier !== oldValueIdentifier) {
			this._value =
				valueIdentifier === null ? null : this.findOption(valueIdentifier);
		}
	}

	@Watch('_value')
	handle_ValueChange() {
		this.onChange.emit({
			identifier: this.identifier,
			value: this._value === null ? null : this._value.identifier
		});
	}

	@Watch('_open')
	handleOpenChange() {
		if (this._open === true) {
			this.onOpen.emit();
		}
	}

	@Listen('onSelect')
	handleOnSelect(event: CustomEvent<IOnSelect>) {
		event.stopPropagation();

		this._value = this.findOption(event.detail.identifier);
		this._open = false;
	}

	@Listen('onClearClick')
	handleOnClearClick(event: CustomEvent) {
		event.stopPropagation();
		this._value = null;
	}

	private handleOnClick() {
		if (!this.blocked) {
			this._open = !this._open;
		}
	}

	private handleClickOutside(event: MouseEvent) {
		if (!this.element.contains((event as any).target)) {
			this._open = false;
		}
	}

	private findOption(identifier: IOption['identifier']) {
		const value = this.options.find(option => option.identifier === identifier);
		return value === undefined ? null : value;
	}

	render() {
		const optionsContainer = (
			<lui-options-container
				showSearch={this.showSearch}
				eventBasedSearch={this.eventBasedSearch}
				options={this.options}
				loading={this.loading}
			/>
		);

		return (
			<Host class="relative">
				<BaseField
					placeholder={this.placeholder}
					focused={this._value !== null}
					blocked={this.blocked}
				>
					<div class="h-full pr-4 absolute flex top-0 right-0 select-none">
						{/* <nf-flag
							class="my-auto mr-3"
							[flag]="cities[selectedIndex].country"
						></nf-flag> */}

						{this._value === null && (
							<img
								class="w-3 m-auto"
								src="/assets/images/arrow-down.png"
								alt=""
							/>
						)}
					</div>

					<input
						type="text"
						class="w-full h-full relative outline-none pt-3 pl-5 pr-8 text-gray-800 bg-transparent text-sm cursor-pointer z-10"
						readOnly={true}
						value={this._value === null ? '' : this._value.name}
						onClick={() => this.handleOnClick()}
					/>

					{this._value !== null && <ClearFieldButton />}

					<div class="relative w-full h-0 overflow-hidden">
						<select
							class="absolute left-0 bottom-0 w-full"
							tabIndex={-1}
							onFocus={event => {
								if (event.target !== null) {
									(event.target as HTMLElement).blur();
								}
							}}
							required={
								this.required && !this.blocked && this._value === null
							}
						>
							<option value=""/>
						</select>
					</div>
				</BaseField>

				{this._open && optionsContainer}
			</Host>
		);
	}
}
