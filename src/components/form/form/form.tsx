import {
	Component,
	Event,
	EventEmitter,
	Listen,
	Method,
	State,
	h
} from '@stencil/core';

import { IOnChange } from '../helpers/IOnChange';

import { IFields } from './IFields';

@Component({
	tag: 'lui-form'
})
export class Form {
	@State() _fields: IFields = {};

	@Event() onSubmit!: EventEmitter<IFields>;
	@Event() onValuesChange!: EventEmitter<IFields>;

	@Listen('onChange')
	handleOnChange(event: CustomEvent<IOnChange>) {
		event.stopPropagation();

		const { identifier, value } = event.detail;
		if (value === null) {
			const { [identifier]: _, ...state } = this._fields;
			this._fields = state;
		} else {
			this._fields = { ...this._fields, [identifier]: value };
		}

		this.onValuesChange.emit(this._fields);
	}

	@Method()
	async clear() {
		this._fields = {};
		this.onValuesChange.emit(this._fields);
	}

	private handleOnSubmit(event: Event) {
		event.preventDefault();
		this.onSubmit.emit(this._fields);
	}

	render() {
		return (
			<form
				onSubmit={(event: Event) => this.handleOnSubmit(event)}
				enctype="multipart/form-data"
			>
				<slot />
			</form>
		);
	}
}
