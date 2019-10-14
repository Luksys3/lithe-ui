export interface IOnChange<T = string | number | string[] | null> {
	identifier: string;
	value: T;
}
