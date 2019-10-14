import { IOnChange } from '../helpers/IOnChange';

export interface IFields {
	[identifier: string]: IOnChange['value'];
}
