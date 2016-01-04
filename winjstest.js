var mySplitView = window.mySplitView = {
        splitView: null,
            trailClicked: WinJS.UI.eventHandler(function (ev) {
            	//implementation here
            }),
    };
WinJS.UI.processAll().done(function () {
	var splitView = document.querySelector(".splitView").winControl;
    new WinJS.UI._WinKeyboard(splitView.paneElement);
});