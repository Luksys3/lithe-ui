import { FunctionalComponent, h } from '@stencil/core';

export const BaseField: FunctionalComponent<{
	placeholder: string;
	focused: boolean;
	blocked?: boolean;
}> = ({ placeholder, focused, blocked = false }, children) => {
	return (
		<div class="relative w-full pt-3 pb-2 bg-white block text-sm text-center rounded border border-gray-300">
			<div
				class={`w-full top-0 h-8 px-5 flex placeholder absolute text-gray-500 ${
					focused ? 'text-xs' : 'h-full text-sm'
				}`}
				style={{
					transition: 'all 0.1s ease-out'
				}}
			>
				<div class="my-auto">{placeholder}</div>
			</div>

			{children}

			{blocked && (
				<div class="absolute inset-0 bg-gray-400 opacity-25 z-10 rounded cursor-not-allowed" />
			)}
		</div>
	);
};
