import { FunctionalComponent, h } from '@stencil/core';

export const ClearFieldButton: FunctionalComponent = () => {
	const handleOnClick = (element: HTMLElement) => {
		element.dispatchEvent(new CustomEvent('onClearClick', { bubbles: true }));
	};

	return (
		<div
			class="h-full pr-4 absolute flex top-0 right-0 z-10 text-gray-800 text-lg select-none cursor-pointer hover:text-gray-600"
			onClick={event => handleOnClick(event.target as HTMLElement)}
		>
			<div class="m-auto pr-px">&times;</div>
		</div>
	);
};
