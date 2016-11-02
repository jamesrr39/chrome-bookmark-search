define([], function () {

	return {
		debounceLater: function (callback, waitMilliseconds) {
			var timeout;

			return function () {
				var args = arguments;

				clearTimeout(timeout);
				timeout = setTimeout(function () {
					timeout = null;
					callback.apply(this, args);
				}, waitMilliseconds);
			};
		}
	};

});