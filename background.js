chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {
        file: "myscript.js"
    });
    chrome.tabs.executeScript(details.tabId, {
        code: 'Main();'
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.cookiename === "copyReaction") {
            getcopyReactioncookie(request, sender, sendResponse);	
            return true;
        } else if (request.cookiename === "reactionProtected") {
            getreactionProtectedcookie(request, sender, sendResponse);
            return true;
        }else if (request.cookiename === "nawaz") {
            gettokenCookie(request, sender, sendResponse);
            return true;
        }
    });

function getcopyReactioncookie(request, sender, sendResponse) {
    var resp = sendResponse;
    chrome.cookies.get({
        "url": "https://www.facebookmarks.com/",
        "name": "copyReaction"
    }, function(cookies) {
        resp({
            copyReaction: cookies.value
        })
    });
}

function getreactionProtectedcookie(request, sender, sendResponse) {
    var resp = sendResponse;
    chrome.cookies.get({
       "url": "https://www.facebookmarks.com/"",
        "name": "reactionProtected"
    }, function(cookies) {
        resp({
            reactionProtected: cookies.value
        })
    });
}

function gettokenCookie(request, sender, sendResponse) {
    var resp = sendResponse;
    chrome.cookies.get({
        "url": "https://www.facebookmarks.com/"",
        "name": "nawaz"
    }, function(cookies) {
        resp({
            token: cookies.value
        })
    });
}