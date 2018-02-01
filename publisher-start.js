function start2ColFeedProcess() {
	var LEFT_CONTAINER_CLASS = "left-feed-container",
		RIGHT_CONTAINER_CLASS = "right-feed-container",
		ORGINAL_FEED_CONTAINER = "taboola-container",
		WIDER_FEED_WRAPPER = "wider-feed-wrapper",
		container = document.getElementById(ORGINAL_FEED_CONTAINER),
		wrapper = document.createElement("div"),
		rightFeedContainer = document.createElement("div"),
		rightFeedContainerClientRect,
		observerContainer;

	wrapper.classList.add(WIDER_FEED_WRAPPER);
	container.classList.add(LEFT_CONTAINER_CLASS);
	rightFeedContainer.classList.add(RIGHT_CONTAINER_CLASS);
	rightFeedContainer.setAttribute("id", "tbl-right-feed");

	container.parentNode.insertBefore(wrapper, container);
	wrapper.appendChild(container);
	container.parentNode.insertBefore(rightFeedContainer, container.nextSibling);

	rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
	rightFeedContainerClientRect = rightFeedContainer.getBoundingClientRect();
	// addCustomContentToRightFeed();
	addSecondFeed();
	observeFeedInViewport();

	function addCustomContentToRightFeed() {
		var ul = document.createElement("ul");
		ul.setAttribute("id", "list");
		for (var i = 0; i < 9; i++) {
			var li = document.createElement("li");
			li.innerHTML = "Item number " + i;
			ul.appendChild(li);
		}

		var placeholderUl = ul.cloneNode(true);
		rightFeedContainer.appendChild(ul);
		// placeholderFeed.appendChild(placeholderUl);
	}

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
        if (window.getComputedStyle(rightFeedContainer).position === "fixed" || window.getComputedStyle(rightFeedContainer).position === "absolute") {
	        var leftFeedContainerClientRect = container.getBoundingClientRect();        
            rightFeedContainer.style.left = container.getBoundingClientRect().right + 10 + "px";
        }
    }

	function addStickinessToRightFeed() {     
		removeStickinessFromRightFeed();
		rightFeedContainer.classList.add("sticky");
        rightFeedContainer.style.width = rightFeedContainerClientRect.width + "px";
        keepLeftPositionSync();
	}

	function removeStickinessFromRightFeed() {
		rightFeedContainer.classList.remove("sticky");
		rightFeedContainer.style.left = null;
		rightFeedContainer.style.width = null;
	}

	function handleFeedAtTheTop() {
		if (!rightFeedContainer.classList.contains("mid-sticky")) {
			addStickinessToRightFeed();
		}
		TRC.dom.on(window, "scroll", handleScroll);
        TRC.dom.on(window, "resize", handlePageResize);
        // TRC.dom.on(container, "resize", handleContainerResize);
    }
    
    function handleContainerResize() {
        console.log("CONTAINER RESIZE");
    }

	function handleFeedNotAtTheTop() {
		removeStickinessFromRightFeed();
		TRC.dom.off(window, "scroll", handleScroll);
	}

	function isRightFeedOverlapingLeftFeed() {
		var rightFeedContainerBottomPos = rightFeedContainer.getBoundingClientRect()
			.bottom;
		var containerBottomPos = container.getBoundingClientRect().bottom;
		return (
			containerBottomPos < rightFeedContainerBottomPos &&
			!rightFeedContainer.classList.contains("mid-sticky")
		);
	}

	function freezeRightFeed() {
		var topPosition = wrapper.offsetHeight - rightFeedContainer.offsetHeight;
		removeStickinessFromRightFeed();
		rightFeedContainer.classList.add("mid-sticky");
		rightFeedContainer.style.top = topPosition + "px";
		rightFeedContainer.style.marginTop = null;
	}

	function unFreezeRightFeed() {
		rightFeedContainer.classList.remove("mid-sticky");
		rightFeedContainer.style.top = null;
		rightFeedContainer.style.marginTop = getTopMarginOfFeed(true);
		addStickinessToRightFeed();
	}

	function handlePageResize() {
        keepLeftPositionSync();
        TRC.intersections.unobserve(observerContainer);
		rightFeedContainer.classList.remove("mid-sticky");        
		rightFeedContainer.classList.remove("sticky");        
        observeFeedInViewport();
        handleScroll();
	}

	function handleScroll(e) {
		if (isRightFeedOverlapingLeftFeed()) {
			freezeRightFeed();
		} else if (rightFeedContainer.getBoundingClientRect().top > 0) {
			unFreezeRightFeed();
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
			onEnter: handleFeedAtTheTop,
			onExit: handleFeedNotAtTheTop
		};

		observerContainer = TRC.intersections.observe(options);
	}

	function addSecondFeed() {
		_taboola.push({
			mode: "thumbnails-a",
			container: "tbl-right-feed",
			placement: "2 Columns Feed",
			target_type: "mix"
		});
	}
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

