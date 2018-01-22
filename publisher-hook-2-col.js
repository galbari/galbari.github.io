var container = document.getElementById('taboola-container');
var wrapper = document.createElement('div');
var newContainer = document.createElement('span');
newContainer.innerHTML = 'boom!'
container.parentNode.insertBefore(wrapper, container);
wrapper.appendChild(container);
container.parentNode.insertBefore(newContainer, container.nextSibling);
