// loadCSSFile();
var showTeaserAfterNumOfSeconds = 3000; // show entire teaser after number of seconds [AKA - X]

function feedTeaser() {
	if (TRC.feedTeaserExecuted) {
		return;
	}

	var config = {
		maxOrganicItems: 2,
		maxSponsoredItems: 1,
		replaceCarouselItemTime: 5000, // Number of seconds of appearence for each item in teaser [AKA - Y]
		variantConfig: ['organic', 'sponsored'], // items types whcih show on new custom card on desktop - organic or sponsored [AKA - special feed]
		variantConfigMobile: ['organic'], // items types whcih show on new custom card on desktop - organic or sponsored [AKA - special feed]
		teaserSidePosition: 'right', // teaser position on desktop -  options: right/left
		mobileVerticalPosition: 'bottom', //teaser position on mobile - options: top/bottom
		fixedPositionElementHeight: {
			// set height of fixed position element so it won't cover the taboola feed logo after auto scroll to feed
			mobile: 0,
			desktop: 0
		},
		itemsTypesMap: {
			organic: handleOrganicClick,
			sponsored: handleSponsoredClick,
			discover: handleDiscoverClick
		},
		scrollDurationSpeed: 2500 // scroll animation duration in miliseconds
	};

	var teaserIsVisible = false,
		doneCarouseling = false,
		countingDownStartTime = 0,
		feedInViewport = false,
		teaserVisibilityRemainingTime = null, // counter when teaser should disappeare for the page e.g 10 (10 seconds after the last item appears the teaser will disappeare)
		mobileScreenWidth = '812px',
		carousel,
		teaserVisibilityCountDown,
		teaserAppearanceTime,
		teaserClickedTime;

	var arrowSVG =
		'<svg class="tbl-arrow-icon arrow-1" viewBox="0 0 52 32">' +
		'<path d="M39.308 1.455h11.601l-24.852 29.091-24.602-29.091h12.25l12.352 14.545z"></path>' +
		'</svg>' +
		'<svg class="tbl-arrow-icon arrow-2" viewBox="0 0 52 32">' +
		'<path d="M39.308 1.455h11.601l-24.852 29.091-24.602-29.091h12.25l12.352 14.545z"></path>' +
		'</svg>';

	var closeSVG =
		'<div class="tbl-teaser-closeBtn">' +
		'<svg width="10px" height="10px" viewBox="0 0 10 10">' +
		'<defs></defs>' +
		'<g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">' +
		'<g id="icons" transform="translate(-23.000000, -130.000000)">' +
		'<polygon id="Desktop-Close-initial" points="33 131.208868 31.7911325 130 28 133.791132 24.2088675 130 23 131.208868 26.7911325 135 23 138.791132 24.2088675 140 28 136.208868 31.7911325 140 33 138.791132 29.2088675 135"></polygon>' +
		'</g>' +
		'</g>' +
		'</svg>' +
		'</div>';

	function scrollToDestination(destination, duration, easing, callback) {
		// Animation code was taken from: https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
		var easings = {
			easeInOutQuart: function(t) {
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
			}
		};

		var start = window.pageYOffset;
		var startTime =
			'now' in window.performance ? performance.now() : new Date().getTime();

		var documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);
		var windowHeight =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.getElementsByTagName('body')[0].clientHeight;
		var destinationOffset =
			typeof destination === 'number' ? destination : destination.offsetTop;
		var destinationOffsetToScroll = Math.round(
			documentHeight - destinationOffset < windowHeight
				? documentHeight - windowHeight
				: destinationOffset
		);


		if ('requestAnimationFrame' in window === false) {
			window.scroll(0, destinationOffsetToScroll);

			if (callback) {
				callback();
			}
			return;
		}

		function scroll() {
			var now =
				'now' in window.performance ? performance.now() : new Date().getTime();
			var time = Math.min(1, (now - startTime) / duration);
			var timeFunction = easings[easing](time);
			var scrollYPosition = Math.ceil(
				timeFunction * (destinationOffsetToScroll - start) + start
			);
			window.scrollTo(0, scrollYPosition);

			if (window.pageYOffset === destinationOffsetToScroll) {
				if (callback) {
					callback();
				}
				return;
			}

			requestAnimationFrame(scroll);
		}

		scroll();
	}

	function cutTextContent(string, endPosition) {
		return string.slice(0, endPosition).trim() + '...';
	}

	function createItemsObj(item) {
		return {
			id: item['item-id'],
			content: item.title || item.description,
			img: item.thumbnail,
			'item-type': item['is-syndicated'] ? 'sponsored' : 'organic',
			cardId: item.cardId
		};
	}

	function getCardByType(cardType) {
		var allCards = TRCImpl.boxes;
		var cardsByRequestedType = [];
		for (var card in allCards) {
			if (
				allCards[card].response.hasOwnProperty('feedPlacement') &&
				allCards[card].itemsTypes &&
				allCards[card].itemsTypes['is-' + cardType]
			) {
				cardsByRequestedType.push(allCards[card]);
			}
		}

		return cardsByRequestedType;
	}

	function getItemsByType(itemType) {
		var cardsArary = getCardByType(itemType);
		return cardsArary.reduce(getAllItemsFromCard, []);
	}

	function getAllItemsFromCard(itemsArray, nextCard) {
		var itemsList = nextCard.response.trc['video-list'].video;
		var cardId = nextCard.container.id;
		itemsList.forEach(function(item) {
			item.cardId = cardId;
		});

		return itemsArray.concat(itemsList);
	}

	function getCardsData() {
		var organicItems = getItemsByType('organic');
		var sponsoredItems = getItemsByType('syndicated');

		organicItems =
			organicItems.length >= config.maxOrganicItems
				? organicItems.slice(0, config.maxOrganicItems)
				: organicItems;
		sponsoredItems =
			sponsoredItems.length >= config.maxSponsoredItems
				? sponsoredItems.slice(0, config.maxSponsoredItems)
				: sponsoredItems;

		var teaserItems = organicItems.concat(sponsoredItems);
		return teaserItems.map(createItemsObj);
	}

	function getItmesAsHtmlString(cardsData) {
		var cardsItemsAsHtmlString = cardsData.reduce(function(html, card, index) {
			var showClass = index === 0 ? 'show' : '';
			var dataType = card['item-type'];
			return (
				html +
				'<li class="item card-holder card-' +
				index +
				' ' +
				showClass +
				'" data-item-id="' +
				card.id +
				'"' +
				'data-item-type=' +
				dataType +
				' teaser-item-index=' +
				index +
				' style="z-index:' +
				index +
				';">' +
				'<div class="img" style="background-image: url(' +
				card.img +
				')"></div>' +
				'<div class="content-container">' +
				'<div class="content">' +
				'<span class="card-content">' +
				card.content +
				'</span>' +
				'</div>' +
				'</div>' +
				'</li>'
			);
		}, '');

		var lastItemDOM =
			'<li class="item tbl-discover-card card-' +
			cardsData.length +
			' "data-item-type="discover" style="z-index:' +
			cardsData.length +
			';">' +
			'<div class="img">' +
			'<div class="mockup-feed-wrapper">' +
			getMockupHTML(cardsData) +
			'</div>' +
			'</div>' +
			'<div class="content-container">' +
			'<div class="content">' +
			'<div class="card-content">' +
			'<div class="discover-card-label">Discover Articles Trending Now</div>' +
			'<div class="discover-card-btn">Jump to the Latest Posts<span class="arrow">' +
			arrowSVG +
			'</span></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</li>';

		cardsItemsAsHtmlString += lastItemDOM;

		return cardsItemsAsHtmlString;
	}

	function getMockupHTML(cardsData) {
		var mockup =
			'<div class="section-wrapper">' +
			'<div class="mockup-section"></div>' +
			'<div class="mockup-row"></div>' +
			'<div class="mockup-span"></div>' +
			'</div>';
		var imagesList = cardsData.map(function(card) {
			return card.img;
		});
		for (var i = 0; i < 2; i++) {
			for (var index = 0; index < imagesList.length; index++) {
				mockup +=
					'<div class="section-wrapper">' +
					'<div class="mockup-section" style="background-image: url(' +
					imagesList[index] +
					')"></div>' +
					'<div class="mockup-row"></div>' +
					'<div class="mockup-span"></div>' +
					'</div>';
			}
		}

		return mockup;
	}

	function createElement(element, id, classes, innerHTML) {
		if (!element) {
			return false;
		}

		var domElement = document.createElement(element);
		domElement.id = id ? id : '';
		domElement.className += classes ? classes : '';
		domElement.innerHTML = innerHTML ? innerHTML : '';

		return domElement;
	}

	function createTeaser(cardsData) {
		var teaser = createElement(
			'div',
			'tbl-teaser',
			'tbl-cards-teaser tbl-teaser-position-' +
				config.teaserSidePosition +
				' tbl-teaser-mobile-position-' +
				config.mobileVerticalPosition
		);
		var innerTeaser = createElement(
			'div',
			'tbl-teaser-inner',
			'tbl-cards-teaser-inner'
		);
		var arrowIcon = createElement('span', null, 'arrow', arrowSVG);
		var header = createElement(
			'div',
			'tbl-up-next',
			'tbl-teaser-header',
			'<span>Up Next</span>'
		);
		var circleArrow = createElement('div', null, 'circle-arrow', '');
		var closeBtn = createElement(
			'div',
			null,
			'tbl-teaser-closeBtn-wrapper',
			closeSVG
		);
		var discoverFeedDiv = createElement(
			'div',
			'discoverFeed',
			'tbl-discover-feed-btn',
			'Discover More Articles <span class="arrow">' + arrowSVG + '</span>'
		);
		var items = getItmesAsHtmlString(cardsData);
		var itemsContainer = createElement(
			'ul',
			'tbl-items-container',
			null,
			items
		);

		innerTeaser.appendChild(discoverFeedDiv);
		innerTeaser.appendChild(header);
		circleArrow.appendChild(arrowIcon);
		innerTeaser.appendChild(circleArrow);
		// innerTeaser.appendChild(arrowIcon);
		innerTeaser.appendChild(itemsContainer);
		teaser.appendChild(innerTeaser);
		teaser.appendChild(closeBtn);
		return teaser;
	}

	function cutText(item) {
		var container = item.parentNode;
		var containerHeight =
			item.parentNode.offsetHeight -
			parseInt(window.getComputedStyle(container).paddingTop, 10);

		while (item.offsetHeight > containerHeight || item.offsetHeight > 41) {
			//replace the last word with ...
			item.innerText = item.innerText.replace(/\W*\s(\S)*$/, '...');
		}
	}

	function handleTextOverflow() {
		var items = getArrayFrom(
			document.querySelectorAll(
				'#tbl-items-container .item.card-holder .content'
			)
		);
		items.forEach(cutText);
	}

	function getFeedElement() {
		return document.querySelector('.tbl-feed-container');
	}

	function sendEvent(eventName, eventType) {
		window._taboola = window._taboola || [];

		_taboola.push({
			name: 'abtests',
			val: {
				abTestsEventType: 'simple',
				name: eventName,
				type: eventType,
				eventTime: new Date().getTime()
			}
		});
	}

	function getBgUrl(el) {
		var bg = '';
		if (el.currentStyle) {
			// IE
			bg = el.currentStyle.backgroundImage;
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			// Firefox
			bg = document.defaultView.getComputedStyle(el, '').backgroundImage;
		} else {
			// try and get inline style
			bg = el.style.backgroundImage;
		}
		return bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
	}

	function listenToImgLoad(callback) {
		var image = document.createElement('img');
		var link = document.createElement('link');
		var src = getBgUrl(document.querySelector('#tbl-items-container .img'));
		if (src === 'none') {
			startTeaserExperience();			
		}

		link.rel = 'preload';
		link.href = src;
		link.as = 'image';
		document.getElementsByTagName('head')[0].appendChild(link);

		image.src = src;
		image.onload = function() {
			startTeaserExperience();
		};
	}

	function addEventsListners() {
		var teaserItems = getArrayFrom(
			document.querySelectorAll('#tbl-items-container li')
		);
		teaserItems.forEach(function(item) {
			item.addEventListener('click', handleItemClick);
		});
		document
			.getElementById('discoverFeed')
			.addEventListener('click', handleDiscoverFeedBtnClick);
		document
			.querySelector('.tbl-teaser-closeBtn')
			.addEventListener('click', handleCloseBtnClick);
		document
			.querySelector('#tbl-teaser')
			.addEventListener('mouseenter', handleTeaserHover);
		document
			.querySelector('#tbl-teaser')
			.addEventListener('mouseleave', handleMouseLeaveTeaser);
	}

	function handleCloseBtnClick(e) {
		e.preventDefault();
		sendEvent('closeTeaserBtnClicked', 'click');
		hideTeaser();
	}

	function handleTeaserHover() {
		sendEvent('teaserHovered', 'hover');
		if (doneCarouseling) {
			pauseTeaserVisibilityCountDown();
		} else {
			stopCarousel();
		}
	}

	function handleMouseLeaveTeaser() {
		if (doneCarouseling) {
			startTeaserVisibilityCountDown();
		} else {
			playCarousel();
		}
	}

	function pauseTeaserVisibilityCountDown() {
		if (teaserVisibilityRemainingTime) {
			teaserVisibilityRemainingTime =
				teaserVisibilityRemainingTime - (new Date() - countingDownStartTime);
			stopTimer(teaserVisibilityCountDown);
		}
	}

	function startTimer(func, time) {
		return window.setInterval(func, time);
	}

	function stopTimer(interval) {
		if (interval) {
			window.clearInterval(interval);
		}
	}

	function resumeTeaserVisibilityCountDown() {
		if (teaserVisibilityRemainingTime) {
			teaserVisibilityCountDown = startTimer(
				hideTeaser,
				teaserVisibilityRemainingTime
			);
			updateCountingDownStartTime();
		}
	}

	function updateCountingDownStartTime() {
		countingDownStartTime = new Date();
	}

	function hideTeaser() {
		var teaser = document.getElementById('tbl-teaser');
		teaser.classList.remove('in-viewport');
		teaserIsVisible = false;
		sendEvent('teaserIsHidden', 'teaserIsHidden');
		stopTimer(teaserVisibilityCountDown);
		stopTimer(carousel);
	}

	function handleItemClick(e) {
		e.preventDefault();
		var clickedItem = e.currentTarget;
		var clickedItemIndex =
			parseInt(clickedItem.getAttribute('teaser-item-index'), 10) + 1;
		var clickItemType = clickedItem.getAttribute('data-item-type');
		var clickedItemData = clickedItemIndex || clickItemType;

		sendEvent('teaserItemClick', clickedItemData);
		hideTeaser();
		config.itemsTypesMap[clickItemType](clickedItem);
	}

	function handleDiscoverFeedBtnClick(e) {
		e.preventDefault();
		sendEvent('discoverMoreArticlesBtnClick', 'click');
		hideTeaser();
		handleDiscoverClick(e.currentTarget);
	}

	function handleOrganicClick(item) {
		var itemId = item.getAttribute('data-item-id');
		var clickedItemData = getItemFromCardsDataByItemId(itemId);
		var chosenItemsIdList = getItemsIdsByVariantConfig(clickedItemData);
		renderCustomCardIntoFeed();
		var chosenItemsNodesList = chosenItemsIdList.map(getItemNodeByItemId);
		chosenItemsNodesList.forEach(handelDomChangeOnItemNode);

		hideTeaser();
		scrollToFeed();
	}

	function getCardIdByItemId(itemId) {
		var filterCardData = cardsData.filter(function(item) {
			return item.id === itemId;
		})[0];

		return filterCardData.cardId;
	}

	function handelDomChangeOnItemNode(itemNode) {
		isOrganicNode = itemNode.getAttribute('data-item-syndicated') === 'false';
		if (isOrganicNode) {
			moveTitleWithLogoSectionUnderTheTumbnailOfNode(itemNode);
		}
		var cardId = getCardIdByItemId(itemNode.getAttribute('data-item-id'));
		var cardContainer = document.getElementById(cardId);
		appendItemIntoNewCard(itemNode);
		handleCardAfterItemMove(cardContainer);
	}

	function appendItemIntoNewCard(itemNode) {
		var newCardSelector =
			'#taboola-teaser-card-container #internal_trc.items-wrapper';
		document.querySelector(newCardSelector).appendChild(itemNode);
	}

	function getArrayFrom(arrayWannaBe) {
		return [].slice.call(arrayWannaBe);
	}

	function handleCardAfterItemMove(cardNode) {
		var itemsList = getArrayFrom(cardNode.getElementsByClassName('videoCube'));
		var numberOfItemsInCard = itemsList.length;
		if (numberOfItemsInCard > 0) {
			cardNode.classList.add('modify-items-container');
			itemsList.forEach(function(nodeItem) {
				nodeItem.classList.add('new-videoCube-items-' + itemsList.length);
				updateImageWithNewDimenssions(nodeItem);
			});
		} else {
			cardNode.remove();
		}
	}

	function handleSponsoredClick(item) {
		scrollToFeed();
	}

	function handleDiscoverClick(item) {
		scrollToFeed();
	}

	function getItemFromCardsDataByItemId(itemId) {
		return cardsData.filter(function(item) {
			return item.id === itemId;
		})[0];
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

	function getItemsIdsByVariantConfig(selectedItem) {
		var itemsIdList = [];
		var itemsConfig = isMobileDevice()
			? config.variantConfigMobile
			: config.variantConfig;
		itemsConfig.forEach(function(type) {
			if (
				!itemsIdList.includes(selectedItem.id) &&
				selectedItem['item-type'] === type
			) {
				itemsIdList.push(selectedItem.id);
			} else {
				var filterItemsIds = cardsData
					.filter(function(item) {
						return (
							!itemsIdList.includes(item.id) &&
							item['item-type'] === type &&
							item.id !== selectedItem.id
						);
					})
					.map(function(filterItem) {
						return filterItem.id;
					});
				itemsIdList = itemsIdList.concat(filterItemsIds);
			}
		});
		return itemsIdList;
	}

	function getItemNodeByItemId(itemId) {
		return document.querySelector('[data-item-id="' + itemId + '"]');
	}

	function updateImageWithNewDimenssions(videoCube) {
		var getNewImage = TRC.implClasses.TRCRBox.prototype.createVideoBoxImageLoader.trcBind(
			videoCube.rbox,
			videoCube
		);
		getNewImage();
	}

	function renderCustomCardIntoFeed() {
		var hasSponsoredClass = config.variantConfig.includes('sponsored')
			? 'has-sponsored'
			: '';

		var newCard = createElement(
			'div',
			'taboola-teaser-card-container',
			'trc_related_container trc_spotlight_widget trc_elastic tbl-feed-card ' +
				hasSponsoredClass,
			''
		);
		newCard.innerHTML =
			'<div class="trc_rbox_container" style="display: block;">' +
			'<div>' +
			'<div id="trc_wrapper" class="trc_rbox thumbnails-feed trc-content-sponsored " style="overflow: hidden; display: block;">' +
			'<div id="trc_header" class="trc_rbox_header trc_rbox_border_elm">' +
			'<div class="trc_header_ext">' +
			'<div class="logoDiv link-adc ">' +
			'<a class="trc_desktop_adc_link trc_attribution_position_top" rel="nofollow" href="http://popup.taboola.com/en/?template=colorbox&amp;utm_source=kentuckysportsradio&amp;utm_medium=referral&amp;utm_content=thumbnails-feed:Below Article Thumbnails | Card 1:" target="_blank">' +
			'<span class="trc_adc_wrapper">' +
			'<span class="trc_adc_s_logo"></span>&nbsp;</span>' +
			'<span class="trc_logos_v_align">&nbsp;</span>' +
			'</a>' +
			'</div>' +
			'<div class="logoDiv link-disclosure attribution-disclosure-link-hybrid">' +
			'<a class="trc_desktop_disclosure_link trc_attribution_position_top" rel="nofollow" href="http://popup.taboola.com/en/?template=colorbox&amp;utm_source=kentuckysportsradio&amp;utm_medium=referral&amp;utm_content=thumbnails-feed:Below Article Thumbnails | Card 1:" target="_blank">' +
			'<span>Promoted Links</span>' +
			'<span class="trc_logos_v_align">&nbsp;</span>' +
			'</a>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="outer" class="trc_rbox_outer">' +
			'<div id="rbox-t2v" class="trc_rbox_div trc_rbox_border_elm">' +
			'<div id="internal_trc" class="items-wrapper">' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="trc_clearer"></div>' +
			'</div>' +
			'</div>' +
			'</div>';

		var firstCard = document.querySelector('[data-card-index="1"]');
		firstCard.parentNode.insertBefore(newCard, firstCard);
	}

	function moveTitleWithLogoSectionUnderTheTumbnailOfNode(organicNode) {
		var organicNodeWithTopTitleAndIcon = organicNode.getElementsByClassName(
			'label-box-with-title-icon'
		);
		if (organicNodeWithTopTitleAndIcon.length) {
			var organicHederSection = organicNodeWithTopTitleAndIcon[0].parentElement;
			organicHederSection.parentNode.insertBefore(
				organicNode.getElementsByClassName('item-thumbnail-href')[0],
				organicHederSection
			);
		} else {
			organicNode.classList.add('no-label-box-with-title-icon');
		}
	}

	function scrollToFeed() {
		var fixMarginTop = 10;
		var feed = getFeedElement();
		// var destination = feed.offsetTop - fixMarginTop;
		var destination = getElementDestinationFromTopOfThePage(feed) - fixMarginTop;
		var fixPositionConfig = isMobileDevice()
			? config.fixedPositionElementHeight.mobile
			: config.fixedPositionElementHeight.desktop;
		destination = destination - fixPositionConfig; //remove Xpx from desitantion so if there is fixed header on the page, it won't cover up the taboola-feed logo
		scrollToDestination(
			destination,
			config.scrollDurationSpeed,
			'easeInOutQuart'
		);
	}

	function getElementDestinationFromTopOfThePage(element) {
		var yPosition = 0;
		while (element) {
			// yPosition += element.offsetTop - element.scrollTop + element.clientTop;
			yPosition += element.offsetTop;
			element = element.offsetParent;
		}

		return yPosition;
	}

	function showNextItem() {
		var allShownItems = document.querySelectorAll('#tbl-teaser .item.show');
		var lastShownItem = allShownItems[allShownItems.length - 1];
		var nextItem = lastShownItem.nextSibling;

		if (nextItem) {
			if (nextItem.classList.contains('tbl-discover-card')) {
				document.getElementById('tbl-teaser').classList.add('discover-mode');
			}
			nextItem.classList.add('show');
		} else {
			doneCarouseling = true;
			stopCarousel();
			startTeaserVisibilityCountDown();
		}
	}

	function startTeaserVisibilityCountDown() {
		if (teaserVisibilityRemainingTime) {
			teaserVisibilityCountDown = startTimer(
				hideTeaser,
				teaserVisibilityRemainingTime
			);
			updateCountingDownStartTime();
		}
	}

	function playCarousel() {
		carousel = startTimer(shouldShowNextItem, config.replaceCarouselItemTime);
	}

	function stopCarousel() {
		stopTimer(carousel);
	}

	function shouldShowNextItem() {
		if (teaserIsVisible) {
			showNextItem();
		} else {
			stopCarousel();
		}
	}

	function showTeaser(slider) {
		slider.classList.add('in-viewport');
		teaserIsVisible = true;
		teaserAppearanceTime = Date.now();
		sendEvent('teaserIsVisible', 'teaserIsVisible');
	}

	function feedInViewportHandler() {
		feedInViewport = true;
		if (teaserIsVisible) {
			hideTeaser();
		}
	}

	function observeFeed(feed) {
		if (feed) {
			var options = {
				targetElement: feed,
				onEnter: feedInViewportHandler
			};

			TRC.intersections.observe(options);
		}
	}

	var cardsData = getCardsData();
	var teaser = createTeaser(cardsData);

	document.body.appendChild(teaser);
	handleTextOverflow();
	addEventsListners();
	observeFeed(getFeedElement());

	function startTeaserExperience() {
		showTeaser(teaser);
		playCarousel();
	}

	setTimeout(function() {
		if (cardsData.length && !feedInViewport) {
			listenToImgLoad();
			// showTeaser(teaser);
			// playCarousel();
		} else {
			var reason =
				cardsData.length < 1
					? 'noCardsData'
					: feedInViewport ? 'feedAlreadyInViewport' : 'unkownReason';
			console.log('preventShowingTeaser', reason);
			sendEvent('preventShowingTeaser', reason);
		}
	}, 0);

	TRC.feedTeaserExecuted = true;
}

function loadCSSFile() {
	var link = document.createElement('link');
	link.href =
		'//s3.amazonaws.com/c3.taboola.com/ui-ab-tests/feed-teaser/feed-teaser-style.css';
	link.type = 'text/css';
	link.rel = 'stylesheet';

	document.getElementsByTagName('body')[0].appendChild(link);
}

setTimeout(function() {
	feedTeaser();
}, showTeaserAfterNumOfSeconds);
