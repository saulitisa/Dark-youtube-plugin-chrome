if (localStorage.activated == undefined)
{
	setIcon(true);
}

var portsByTabId = {};

chrome.self.onConnect.addListener(function(port) {
	portsByTabId[port.tab.id] = port;
});

function sendMessage(message)
{
	for (var tabid in portsByTabId)
	{
		var port = portsByTabId[tabid];
		try
		{
			port.postMessage(message);
		}
		catch (e)
		{
			delete portsByTabId[tabid];
		}
	}
}

function updateIcon()
{
	if (localStorage.activated != "false")
	{
		localStorage.activated = "false";
		chrome.browserAction.setIcon({path:"images/white_youtube_19.png"});
	}
	else
	{
		localStorage.activated = "true";
		chrome.browserAction.setIcon({path:"images/black_youtube_19.png"});
	}
	
	sendMessage(localStorage.activated);
}

function setIcon(dark)
{
	if (!dark)
	{
		localStorage.activated = "false";
		chrome.browserAction.setIcon({path:"images/white_youtube_19.png"});
	}
	else
	{
		localStorage.activated = "true";
		chrome.browserAction.setIcon({path:"images/black_youtube_19.png"});
	}
	sendMessage(localStorage.activated);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "isActivated")
      sendResponse({status: localStorage.activated});
    else
      sendResponse({});
});

updateIcon();
chrome.browserAction.onClicked.addListener(updateIcon);