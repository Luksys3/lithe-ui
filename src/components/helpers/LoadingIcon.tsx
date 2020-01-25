import { FunctionalComponent, h } from '@stencil/core';

export const LoadingIcon: FunctionalComponent<{
	size?: number;
	position?: 'top' | '';
} | null> = props => {
	const size = props !== null && props.size !== undefined ? props.size : 5;
	const position =
		props !== null && props.position !== undefined ? props.position : 5;

	return (
		<svg
			class={`w-${size} h-${size} text-black m-auto ${
				position === 'top' ? 'mt-24' : ''
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
	);
};
