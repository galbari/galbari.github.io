TRC.feedTeaserSlider = function() {
	var options = {};
	//check the variant id func
	loadTeaser(options);

	function loadTeaser(options) {
		var jsSrc = '//s3.amazonaws.com/c3.taboola.com/ui-ab-tests/feed-teaser/cdn-teaser.js';
		var cssSrc = '//s3.amazonaws.com/c3.taboola.com/ui-ab-tests/feed-teaser/feed-teaser-style.css';
      
		function loadCSSFile() {
			var link = document.createElement('link');
			link.href = cssSrc;
			link.type = 'text/css';
			link.rel = 'stylesheet';
			document.getElementsByTagName('body')[0].appendChild(link);
		}

		function loadScriptFile() {
			var teaserScript = document.createElement('script');
			teaserScript.id = 'teaser-test-script';
			teaserScript.onload = function() {
				TRC.executeFeedTeaser(options);
			};
			teaserScript.src = jsSrc;
			document.getElementsByTagName('head')[0].appendChild(teaserScript);
		}

		loadCSSFile();
		loadScriptFile();
	}
};
