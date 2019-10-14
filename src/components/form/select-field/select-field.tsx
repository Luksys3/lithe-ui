import {
	Component,
	h,
	Host,
	Prop,
	State,
	Event,
	Watch,
	Listen,
	Element,
	EventEmitter
} from '@stencil/core';
import { BaseField } from '../helpers/BaseField';
import { IOption } from './IOption';
import { IOnSelect } from '../options-container/IOnSelect';
import { IOnChange } from '../helpers/IOnChange';

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

	@Listen('onSelect')
	handleOnSelect(event: CustomEvent<IOnSelect>) {
		event.stopPropagation();

		this._value = this.findOption(event.detail.identifier);
		this._open = false;
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

	private handleOnClick() {
		if (!this.blocked) {
			this._open = !this._open;
		}
	}

	private handleOnClearClick() {
		this._value = null;
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
		const clearButton = (
			<div
				class="h-full pr-4 absolute flex top-0 right-0 z-10 text-gray-800 text-lg select-none cursor-pointer hover:text-gray-600"
				onClick={() => this.handleOnClearClick()}
			>
				<div class="m-auto pr-px">&times;</div>
			</div>
		);
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

					{this._value !== null && clearButton}

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
							<option value=""></option>
						</select>
					</div>
				</BaseField>

				{this._open && optionsContainer}
			</Host>
		);
	}
}
