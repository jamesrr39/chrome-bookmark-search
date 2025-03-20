
export function debounceLater(callback: () => void, waitMilliseconds: number) {
	let timeout: number | undefined;

	return function () {

		clearTimeout(timeout);
		timeout = setTimeout(function () {
			timeout = undefined;
			callback();
		}, waitMilliseconds);
	};
}
