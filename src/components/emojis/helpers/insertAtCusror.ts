export const insertAtCursor = (
	input: HTMLTextAreaElement | HTMLInputElement,
	value: string
) => {
	// IE support
	if ((document as any).selection) {
		input.focus();
		const selection = (document as any).selection.createRange();
		selection.text = value;
	} else if (input.selectionStart !== null) {
		const startPosition = input.selectionStart as number;
		const endPosition = input.selectionEnd as number;
		input.value =
			input.value.substring(0, startPosition) +
			value +
			input.value.substring(endPosition, input.value.length);

		const newPosition = startPosition + value.length;
		input.selectionStart = newPosition;
		input.selectionEnd = newPosition;
	} else {
		input.value += value;
	}

	return input.value;
};
