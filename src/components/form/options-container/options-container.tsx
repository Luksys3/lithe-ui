import {
	Component,
	Event,
	EventEmitter,
	Host,
	Listen,
	Prop,
	State,
	Watch,
	h
} from '@stencil/core';

import { IOption } from '../select-field/IOption';

import { IOnSelect } from './IOnSelect';

@Component({ tag: 'lui-options-container' })
export class OptionsContainer {
	@Prop() options!: IOption[];
	@Prop() showSearch = true;
	@Prop() eventBasedSearch = false;
	@Prop() loading = false;

	@State() _options!: IOption[];
	@State() _filteredOptions!: IOption[];
	@State() _searchText = '';

	@Event() onSelect!: EventEmitter<IOnSelect>;
	@Event() onSearchTextChange!: EventEmitter<string>;

	private _searchBox: HTMLLuiSearchBoxElement | undefined;
	private _minSearchLength!: number;
	private _searchTimeoutId: NodeJS.Timeout | undefined;

	componentWillLoad() {
		this._minSearchLength = this.eventBasedSearch ? 3 : 0;

		this._options = this.options;
		this._filteredOptions = this._options;
	}

	componentDidLoad() {
		if (this._searchBox !== undefined) {
			this._searchBox.focusInput();
		}
	}

	@Listen('onSearchChange')
	handleOnChange(event: CustomEvent<string>) {
		event.stopPropagation();

		this._searchText = event.detail;
		if (!this.eventBasedSearch) {
			this._filteredOptions = this.filterOptions(this._options, this._searchText);
			return;
		}

		if (this._minSearchLength > this._searchText.length) {
			this._filteredOptions = [];
			return;
		}

		if (this._searchTimeoutId !== undefined) {
			clearTimeout(this._searchTimeoutId);
		}
		this._searchTimeoutId = setTimeout(() => {
			this.onSearchTextChange.emit(this._searchText);
		}, 500);
	}

	@Watch('options')
	handleOptionsChange() {
		this._options = this.options;
		this._filteredOptions = this.eventBasedSearch
			? this._options
			: this.filterOptions(this._options, this._searchText);
	}

	private handleOnClick(identifier: IOption['identifier']) {
		this.onSelect.emit({ identifier });
	}

	private getSearchKeys(searchText: string) {
		return searchText
			.trim()
			.replace(/ {2}/g, ' ')
			.split(' ')
			.map(key => key.toLowerCase());
	}

	private filterOptions(options: IOption[], searchText: string) {
		const searchKeys = this.getSearchKeys(searchText);
		return options.filter(
			option =>
				searchKeys.every(
					key => option.name.toLowerCase().indexOf(key) !== -1
				) ||
				(option.nameAscii === undefined
					? false
					: searchKeys.every(
							key => option.nameAscii!.toLowerCase().indexOf(key) !== -1
					  ))
		);
	}

	render() {
		const searchBox = (
			<div class="pb-3 px-3">
				<lui-search-box
					ref={node => {
						if (node !== undefined) {
							this._searchBox = node;
						}
					}}
				/>
			</div>
		);
		const options = this._filteredOptions.map(({ identifier, name }) => (
			<div
				key={identifier}
				onMouseDown={() => this.handleOnClick(identifier)}
				class="px-5 py-1 cursor-pointer text-gray-800 hover:bg-gray-100"
			>
				{name}
			</div>
		));

		const needMoreLettersAmount = this._minSearchLength - this._searchText.length;
		const note =
			needMoreLettersAmount > 0
				? `Enter ${needMoreLettersAmount} more letter${
						needMoreLettersAmount === 1 ? '' : 's'
				  }`
				: '';

		return (
			<Host class="relative block">
				<div class="absolute w-full pt-3 mt-1 bg-white text-sm rounded border border-gray-300 shadow-md z-20">
					{this.showSearch && searchBox}

					<div
						class={`overflow-y-auto ${
							options.length === 0 && note === '' ? '' : 'pb-3'
						}`}
						style={{ maxHeight: '220px' }}
					>
						{options}

						{options.length === 0 && note !== '' && (
							<div class="px-5 py-1 text-gray-700">{note}</div>
						)}
					</div>

					{this.loading && <lui-loader />}
				</div>
			</Host>
		);
	}
}
