
type Func<T> = (thing: T) => void;

export function debounceLater<T>(callback: Func<T>, waitMilliseconds: number) {
	let timeout: number | undefined;

	return function (thing: T) {

		clearTimeout(timeout);
		timeout = setTimeout(function () {
			timeout = undefined;
			callback(thing);
		}, waitMilliseconds);
	};
}
