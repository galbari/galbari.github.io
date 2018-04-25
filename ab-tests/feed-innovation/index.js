var tansformers = function() {
	var config = {
		headerClassName: 'blog-title',
		imgClassName: 'img-fluid',
		descriptionClassName: 'blog-description',
    hiddenElementsClassNames: ['blog-masthead', 'blog-header', 'blog-post'],
    closeButtonId: 'tblCloseBtn'
	};
	var feedObserver;

	function getOrganicCard() {
		var organicCardIndication = document.querySelector(
			'.tbl-feed-container .tbl-feed-card .trc-content-organic'
		);
		var organicCard = organicCardIndication
			? findAncestor(organicCardIndication, 'tbl-feed-card')
			: null;

		return organicCard;
	}

	function findAncestor(el, className) {
		while ((el = el.parentElement) && !el.classList.contains(className));
		return el;
	}

	function createCard() {
		var el = document.createElement('div');
		el.id = 'tbl-transformer-card';
		el.classList.add('tbl-transformer');
		return el;
	}

	function appendFakeCardToFeed(fakeCard) {
		var feedHeader = document.querySelector(
			'.tbl-feed-container .tbl-feed-header'
		);
		feedHeader.parentNode.insertBefore(fakeCard, feedHeader.nextSibling);
	}

	function hideEntierPage() {
    document.getElementById(config.closeButtonId).style.display = 'none';
		config.hiddenElementsClassNames.forEach(function(className) {
			document.querySelector('.' + className).style.display = 'none';
		});
	}

	function executeFeedTakeOver() {
		console.log('OBSERVED 🚀');
		var transformerCard = document.getElementById('tbl-transformer-card');
		transformerCard.classList.add('show');
		// if (window.scrollY !== 0) window.scroll(0, 0);
		window.scrollY !== 0 ? window.scroll(0, 0) : transformerCard.offsetHeight;
		// var height = transformerCard.offsetHeight; // force browser reflow so fade-in effect will take place smoothly
		transformerCard.classList.add('fade-in');
		hideEntierPage();
		TRC.intersections.unobserve(feedObserver);
	}

	function observeFeed(feed) {
		if (feed) {
			var options = {
				targetElement: feed,
				threshold: isMobileDevice() ? [0.15] : [0.15],
				onEnter: executeFeedTakeOver
			};

			feedObserver = TRC.intersections.observe(options);
		}
	}

	function createCloseButton() {
		var closeButton = document.createElement('div');
		closeButton.id = config.closeButtonId;
		closeButton.classList = 'tbl-close-button';
		closeButton.innerHTML =
			'<div class="icon-wrap"></div>' +
			'<svg class="icon icon--close icon--green-gradient " viewBox="0 0 20 20" version="1.1" aria-labelledby="title"><path d="M0,2.9h2.9V0H0V2.9z M2.9,5.7h2.9V2.9H2.9V5.7z M5.7,8.6h2.9V5.7H5.7V8.6z M8.6,11.4h2.9V8.6H8.6V11.4z M5.7,14.3h2.9v-2.9H5.7V14.3z M2.9,17.1h2.9v-2.9H2.9V17.1z M0,20h2.9v-2.9H0V20z M11.4,14.3h2.9v-2.9h-2.9V14.3z M14.3,17.1h2.9v-2.9h-2.9V17.1zM17.1,20H20v-2.9h-2.9V20z M11.4,8.6h2.9V5.7h-2.9V8.6z M14.3,5.7h2.9V2.9h-2.9V5.7z M17.1,2.9H20V0h-2.9V2.9z"></path></svg>' +
			'<div class="progress-wrap">' +
			'<svg viewBox="0 0 50 50"><circle class="progress-circle" cx="25" cy="25" r="22" style="stroke-dasharray: 137.4; stroke-dashoffset: 133.003;"></circle></svg>' +
			'</div>';
		closeButton.onclick = executeFeedTakeOver;

		return closeButton;
	}

	function createTransformerCard() {
		var organicCard = getOrganicCard();
		var newCard = organicCard.cloneNode(true);
		newCard.id = 'tbl-transformer-card';
		newCard.classList.add('tbl-transformer');
		newCard.querySelector(
			'.video-label.video-title'
		).textContent = document.getElementsByClassName(
			config.headerClassName
		)[0].textContent;
		newCard.querySelector(
			'.thumbBlock_holder .thumbBlock'
		).style.backgroundImage =
			'url("' +
			document.getElementsByClassName(config.imgClassName)[0].src +
			'")';
		newCard.querySelector(
			'.video-label.video-description'
		).textContent = document.getElementsByClassName(
			config.descriptionClassName
		)[0].textContent;

		return newCard;
	}

	function isMobileDevice() {
		var isMobile = false;
		(function(a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				isMobile = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return isMobile;
	}

	// var fakeCard = createCard();
	// appendFakeCardToFeed(fakeCard);
	var transformerCard = createTransformerCard();
	var closeButton = createCloseButton();
	document.getElementsByTagName('body')[0].appendChild(closeButton);
	appendFakeCardToFeed(transformerCard);
	observeFeed(document.querySelector('.tbl-feed-container'));
};
setTimeout(function() {
	tansformers();
}, 4000);
