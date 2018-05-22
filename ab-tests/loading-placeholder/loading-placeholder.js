function startHook() {
	// put everything inside this function so it will work in the hook
	// TRC.aspect.after(TRC.Feed.prototype, 'createLoadingSpinner', function() {
	//   MY FUNC HERE
	// }, true);

	function createElement(node, classNamesArray) {
		var el = document.createElement(node);
		classNamesArray.forEach(function (className) {
			el.classList.add(className);
		});

		return el;
	}

	function getPlaceholderElement() {
		if (document.getElementById('tbl-loader-placeholder')) return false;
		var placeholderElement = document.createElement('div');
		placeholderElement.id = 'tbl-loader-placeholder';

		for (let i = 0; i < 3; i++) {
			placeholderElement.appendChild(createPlaceholderNode());
		}

		return placeholderElement;
	}

	function loadDummyImg() {
		var dummyImg = createElement('img', ['dummy-img']);
		dummyImg.width = '1px';
		dummyImg.height = '1px';
		dummyImg.style.visibility = 'hidden';
		dummyImg.src = '//s3.amazonaws.com/c3.taboola.com/ui-ab-tests/img/loader-animation.gif';
		dummyImg.onload = function () {
			this.remove();
		}

		document.getElementsByTagName('body')[0].appendChild(dummyImg);
		// document.querySelector('.tbl-feed-container').insertBefore(dummyImg, document.querySelector('.tbl-feed-header'));

	}

	function createPlaceholderNode() {
		loadDummyImg()

		var pl = createElement('div', ['tbl-placeholder-card']);
		var imgTxtMargin = createElement('div', ['tbl-img-text-margin', 'tbl-masker']);
		var firstRowTopMargin = createElement('div', [
			'tbl-first-row-top-margin',
			'tbl-masker'
		]);
		var firstRow = createElement('div', ['tbl-first-row-pl', 'tbl-masker']);
		var secondRow = createElement('div', ['tbl-second-row-pl', 'tbl-masker']);
		var thirdRow = createElement('div', ['tbl-third-row-pl', 'tbl-masker']);
		var firstRowBottomMargin = createElement('div', [
			'tbl-first-row-bottom-margin',
			'tbl-masker'
		]);
		var firstRowRightPadding = createElement('div', [
			'tbl-first-row-right-padding',
			'tbl-masker'
		]);
		var secondRowBottomMargin = createElement('div', [
			'tbl-second-row-bottom-margin',
			'tbl-masker'
		]);
		var thirdRowBottomMargin = createElement('div', [
			'tbl-third-row-bottom-margin',
			'tbl-masker'
		]);


		pl.appendChild(imgTxtMargin);
		pl.appendChild(firstRowTopMargin);
		pl.appendChild(firstRow);
		pl.appendChild(secondRow);
		pl.appendChild(thirdRow);
		pl.appendChild(firstRowBottomMargin);
		pl.appendChild(secondRowBottomMargin);
		pl.appendChild(thirdRowBottomMargin);
		pl.appendChild(firstRowRightPadding);

		return pl;
	}

	var loader = document.querySelector('.tbl-loading-spinner');
	var feedContainer = document.querySelector('.tbl-feed-container');
	if (loader) {
		loader.classList.add('tbl-loading-placeholder-wrapper');
		placeholderNode = getPlaceholderElement();
		if (placeholderNode) {
			loader.appendChild(placeholderNode);
			if (feedContainer) {
				feedContainer.classList.add('render-late');
			}
		}
	}
}

setTimeout(function () {
	startHook();
}, 3000);