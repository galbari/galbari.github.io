var trcManager = this,
	variant1 = "7|1820",
	variantArr = [variant1],
	placement = ["Below Article Thumbnails"];

try {
	TRC.aspect.before(
		trcManager,
		"renderRBox",
		function(rbox, options) {
			try {
				if (placement.indexOf(options.placement) !== -1) {
					TRC.aspect.after(
						rbox,
						"loadScriptCallback",
						function(cacheKey, response) {
							try {
								var currentVariant = response.trc["test-data"];

								if (variantArr.indexOf(currentVariant) !== -1 && TRC.blockState === 0) {
                                    twoColFeed()
                                }
							} catch (e) {
								console.log(e);
							}
						},
						true
					);
				}
			} catch (e) {
				console.log(e);
			}
		},
		false
	);
} catch (e) {
	console.log(e);
}

function twoColFeed () {
	if (TRC.twoColFeedExecuted) {
		return;
	}

	function start2ColFeedProcess() {
		var LEFT_CONTAINER_CLASS = "tbl-left-feed-container",
			RIGHT_CONTAINER_CLASS = "tbl-right-feed-container",
			RIGHT_CONTAINER_ID = "tbl-right-feed",
			ORGINAL_FEED_CONTAINER = "taboola-container",
			FEEDS_WRAPPER = "tbl-feeds-wrapper",
			STICKY_CLASS = "tbl-sticky",
			ABSLT_POS_CLASS = "tbl-abslt-pos",
			container = document.getElementById(ORGINAL_FEED_CONTAINER),
			wrapper = document.createElement("div"),
			rightFeedContainer = document.createElement("div"),
			rightFeedContainerClientRect,
			observerContainer,
			taboolaPushConfig = {
				mode: "thumbnails-a",
				container: "tbl-right-feed", //taboola-below-article-thumbnails
				placement: "2 Columns Feed",
				target_type: "mix"
			}

		wrapper.classList.add(FEEDS_WRAPPER);
		container.classList.add(LEFT_CONTAINER_CLASS);
		rightFeedContainer.classList.add(RIGHT_CONTAINER_CLASS);
		rightFeedContainer.setAttribute("id", RIGHT_CONTAINER_ID);

		container.parentNode.insertBefore(wrapper, container);
		wrapper.appendChild(container);
		container.parentNode.insertBefore(
			rightFeedContainer,
			container.nextSibling
		);

		rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
		rightFeedContainerClientRect = rightFeedContainer.getBoundingClientRect();
		addSecondFeed();
		observeFeedInViewport();

		function getViewportHeight() {
			return Math.max(
				document.documentElement.clientHeight,
				window.innerHeight || 0
			);
		}

		function getLogoHeight() {
			return document.querySelector(".tbl-feed-header").offsetHeight;
		}

		function getTopMarginOfFeed(shouldReturnPxValue) {
			var containerMarginTop = parseInt(
				window.getComputedStyle(container).marginTop,
				10
			);
			var topMargin = getLogoHeight() + containerMarginTop;
			return shouldReturnPxValue ? topMargin + "px" : topMargin;
		}

		function keepLeftPositionSync() {
			var leftFeedContainerClientRect = container.getBoundingClientRect();
			rightFeedContainer.style.left =
				container.getBoundingClientRect().right + 10 + "px";
		}

		function addStickinessToRightFeed() {
			removeStickinessFromRightFeed();
			rightFeedContainer.style.width =
				rightFeedContainer.getBoundingClientRect().width + "px";
			rightFeedContainer.classList.add(STICKY_CLASS);
			keepLeftPositionSync();
		}

		function removeStickinessFromRightFeed() {
			rightFeedContainer.classList.remove(STICKY_CLASS);
			rightFeedContainer.style.left = null;
			rightFeedContainer.style.width = null;
		}

		function handleLeftFeedTouchesTopOfViewport() {
			if (!rightFeedContainer.classList.contains(ABSLT_POS_CLASS)) {
				addStickinessToRightFeed();
			}
			TRC.dom.on(window, "scroll", handleScroll);
			TRC.dom.on(window, "resize", handlePageResize);
			container.addEventListener("resize", handlePageResize);
			// TRC.dom.on(container, "resize", handlePageResize);
		}

		function handleLeftFeedIsPartOrOutsideTheViewport() {
			removeStickinessFromRightFeed();
			TRC.dom.off(window, "scroll", handleScroll);
		}

		function isRightFeedOverlapingLeftFeed() {
			var rightFeedContainerBottomPos = rightFeedContainer.getBoundingClientRect()
				.bottom;
			var containerBottomPos = container.getBoundingClientRect().bottom;
			return containerBottomPos < rightFeedContainerBottomPos;
		}

		function freezeRightFeed() {
			var topPosition = wrapper.offsetHeight - rightFeedContainer.offsetHeight;
			removeStickinessFromRightFeed();
			rightFeedContainer.classList.add(ABSLT_POS_CLASS);
			rightFeedContainer.style.top = topPosition + "px";
			rightFeedContainer.style.marginTop = null;
		}

		function unFreezeRightFeed() {
			rightFeedContainer.classList.remove(ABSLT_POS_CLASS);
			rightFeedContainer.style.top = null;
			rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
			addStickinessToRightFeed();
		}

		function isRightFeedInFixedPosition() {
			return (
				rightFeedContainer.classList.contains(STICKY_CLASS) &&
				!rightFeedContainer.classList.contains(ABSLT_POS_CLASS)
			);
		}

		function handlePageResize() {
			rightFeedContainerClientRect = rightFeedContainer.getBoundingClientRect();
			TRC.intersections.unobserve(observerContainer);
			if (isRightFeedInFixedPosition()) {
				observeFeedInViewport();
				keepLeftPositionSync();
			} else {
				removeStickinessFromRightFeed();
				observeFeedInViewport();
			}
		}

		function handleScroll(e) {
			if (isRightFeedOverlapingLeftFeed()) {
				freezeRightFeed();
			} else if (rightFeedContainer.getBoundingClientRect().top > 0) {
				unFreezeRightFeed();
			} else if (
				parseInt(container.getBoundingClientRect().bottom, 10) >
				parseInt(rightFeedContainer.getBoundingClientRect().bottom, 10)
			) {
				// This func fires beacuse I can't tell when a new batch is loading/loaded inside the left feed
				// When new batch loaded remove abslt-pos from right feed and add fixed pos to it
				unFreezeRightFeed();
				addStickinessToRightFeed();
			}
		}

		function getRootMargin() {
			var viewportHeight = getViewportHeight();
			var logoHeight = getLogoHeight();
			var rootMarginTop = logoHeight + "px";
			var rootMarginBottom = (viewportHeight + logoHeight) * -1 + "px";
			return rootMarginTop + " 0px " + rootMarginBottom + " 0px";
		}

		function observeFeedInViewport() {
			var rootMargin = getRootMargin();
			var options = {
				targetElement: container,
				rootMargin: rootMargin,
				onEnter: handleLeftFeedTouchesTopOfViewport,
				onExit: handleLeftFeedIsPartOrOutsideTheViewport
			};

			observerContainer = TRC.intersections.observe(options);
		}

		function addSecondFeed() {
			_taboola.push(taboolaPushConfig);
		}

		TRC.twoColFeedExecuted = true;
	}

	_taboola.push({
		listenTo: "render",
		handler: function() {
			if (!TRC.rrLoaded && Object.keys(TRCImpl.feeds).length) {
				TRC.rrLoaded = true;
				start2ColFeedProcess();
			}
		}
	});
};
