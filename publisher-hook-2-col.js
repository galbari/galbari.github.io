var LEFT_CONTAINER_CLASS = "left-feed-container",
	RIGHT_CONTAINER_CLASS = "right-feed-container";

var container = document.getElementById("taboola-container");
var wrapper = document.createElement("div");
var rightFeedContainer = document.createElement("div");

function addClass(element, className) {
	if (element.classList) element.classList.add(className);
	else element.className += " " + className;
}

addClass(container, LEFT_CONTAINER_CLASS);
addClass(rightFeedContainer, RIGHT_CONTAINER_CLASS);

container.parentNode.insertBefore(wrapper, container);
wrapper.appendChild(container);
container.parentNode.insertBefore(rightFeedContainer, container.nextSibling);
