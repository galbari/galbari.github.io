function startHook() {
  // put everything inside this function so it will work in the hook
  // TRC.aspect.after(TRC.Feed.prototype, 'createLoadingSpinner', function() {
  //   var that = this;
  //   console.log(this);
  // }, true);

  function createElement(node, classNamesArray) {
    var el = document.createElement(node);
    classNamesArray.forEach(function(className) {
      el.classList.add(className);      
    });

    return el;
  }

  function getPlaceholderElement () {
    var placeholderElement = document.createElement('div');
    placeholderElement.id = 'loader-placeholder';

    for (let i = 0; i < 3; i++) {
      placeholderElement.appendChild(createPlaceholderNode());
    }
    
    return placeholderElement;
  }

  function createPlaceholderNode() {
    var pl = createElement('div', ['tbl-placeholder-card']);
    var imgPl = createElement('div', ['tbl-img-text-margin', 'tbl-masker']);
    var titlePl = createElement('div', ['tbl-first-row-top-margin', 'tbl-masker']);
    var firstRow = createElement('div', ['tbl-first-row-pl', 'tbl-masker']);
    var secondRow = createElement('div', ['tbl-second-row-pl', 'tbl-masker']);
    var thirdRow = createElement('div', ['tbl-third-row-pl', 'tbl-masker']);
    var descPl = createElement('div', ['tbl-first-row-bottom-margin', 'tbl-masker']);
    var descPl4 = createElement('div', ['tbl-first-row-right-padding', 'tbl-masker']);
    var descPl2 = createElement('div', ['tbl-second-row-bottom-margin', 'tbl-masker']);
    var descPl3 = createElement('div', ['tbl-third-row-bottom-margin', 'tbl-masker']);

    pl.appendChild(imgPl);
    pl.appendChild(titlePl);
    pl.appendChild(firstRow);
    pl.appendChild(secondRow);
    pl.appendChild(thirdRow);
    pl.appendChild(descPl);
    pl.appendChild(descPl2);
    pl.appendChild(descPl3);
    pl.appendChild(descPl4);

    return pl;
  }

  var loader = document.querySelector('.tbl-loading-spinner');
  // loader.classList.remove('tbl-loading-spinner');
  loader.classList.add('tbl-loading-placeholder-wrapper');
  placeholderNode = getPlaceholderElement();
  loader.appendChild(placeholderNode);
}

setTimeout(function(){
  startHook();
}, 3000)