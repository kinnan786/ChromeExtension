// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    //attributeFilter:false
    attributeOldValue: true,
    characterDataOldValue: true
};

var hyperfeedid = ""
var reactionProtected;
var copyReaction;
var token = "";
var domain = "https://www.facebookmarks.com/";

function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function Main_NewsFeed_Callback(mutations, observer) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes[0] == null) return null;
            if (mutation.addedNodes[0].nodeName.toLowerCase() == "div") {
                if (mutation.addedNodes[0].className == "_4ikz") {
                    if (mutation.addedNodes[0].children.length == 0) {
                        setTimeout(function() {
                            if (mutation.addedNodes[0].children.length == 0) console.log("empty 1");
                            else {
                                var div_class_4ikz = mutation.addedNodes[0];
                                if (hyperfeedid != div_class_4ikz.id) {
                                    var div_class_none = div_class_4ikz.lastChild;
                                    var div_id_u_jsonp_2_0 = div_class_none.lastChild;
                                    var dataft = div_id_u_jsonp_2_0.lastChild;
                                    if (dataft.children.length == 5) {
                                        hyperfeedid = div_class_4ikz.id;
                                        NewPosts(div_class_4ikz);
                                    } else {
                                        console.log("empty 2");
                                    }
                                }
                            }
                        }, 5000);
                    }
                } else if (mutation.addedNodes[0].className === "_1oxj uiLayer") {

                    var div_class_userContentWrapper_5pcr = findAncestor(mutation.addedNodes[0], "userContentWrapper");
                    var div_class_iu_ = mutation.addedNodes[0].getElementsByClassName("_iu-");

                    var postid = getPostId("none", div_class_userContentWrapper_5pcr);
                    var postlink = getPostId("getpostlink", div_class_userContentWrapper_5pcr);
                    var pageid = getPageId(div_class_userContentWrapper_5pcr);

                    appendReactions(postlink, postid, pageid, div_class_iu_[0], div_class_userContentWrapper_5pcr);
                }
            }
        }
    });
}

function Home_feedstream_Post_observer_Callback(mutations, observer) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes[0] == null) return null;
            if (mutation.addedNodes[0].className === "_1oxj uiLayer") {
                var div_class_userContentWrapper_5pcr = findAncestor(mutation.addedNodes[0], "userContentWrapper");
                var div_class_iu_ = mutation.addedNodes[0].getElementsByClassName("_iu-");

                var postid = getPostId("none", div_class_userContentWrapper_5pcr);
                var postlink = getPostId("getpostlink", div_class_userContentWrapper_5pcr);
                var pageid = getPageId(div_class_userContentWrapper_5pcr);

                appendReactions(postlink, postid, pageid, div_class_iu_[0], div_class_userContentWrapper_5pcr);
                observer.disconnect();
            }
        }
    });
}

var bodyflag = 0;

function Facebook_Body_Callback(mutations, observer) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes[0] != null) {
                if (mutation.addedNodes[0].id != null) {
                    if (mutation.addedNodes[0].id == "photos_snowlift") {
                        var div_class_3t09 = mutation.addedNodes[0].getElementsByClassName("_3t09")
                        if (bodyflag == 0) {
                            bodyflag = 1;
                            Facebook_Popup_observer.observe(div_class_3t09[0], config);
                        }
                        observer.disconnect();
                    }
                }
            }
        }
    });
}

function Facebook_Popup_Callback(mutations, observer) {
    var pageid = null;
    var postid = null;
    var postlink = null;
    var div_class_fbPhotosSnowliftFeedback = null;
    var span_id_fbPhotoSnowliftTimestamp = null;
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes[0] != null) {
                if (mutation.addedNodes[0].className != null) {
                    if (mutation.addedNodes[0].className === "_hli") {
                        pageid = Parse_PageId(mutation.addedNodes[0]);
                    }
                    // this works from public popup
                    if (mutation.addedNodes[0].className === "_39g5" || mutation.addedNodes[0].className === "fbPhotosSnowliftFeedback") {
                        postid = Parse_PostId(mutation.addedNodes[0]);
                        postlink = Parse_PostLink(mutation.addedNodes[0]);

                    } // this works from private popup 
                    if (mutation.addedNodes[0].id != null) {
                        if (mutation.addedNodes[0].id === "fbPhotoSnowliftTimestamp") {
                            span_id_fbPhotoSnowliftTimestamp = mutation.addedNodes[0];
                            postid = Parse_PostId(span_id_fbPhotoSnowliftTimestamp.getElementsByClassName("_39g5")[0]);
                            postlink = Parse_PostLink(span_id_fbPhotoSnowliftTimestamp.getElementsByClassName("_39g5")[0]);
                        }
                    }
                    if (mutation.addedNodes[0].className === "fbPhotosSnowliftFeedback") {
                        div_class_fbPhotosSnowliftFeedback = mutation.addedNodes[0];
                    }
                    if (pageid != null && postid != null && postlink != null) {
                        if (div_class_fbPhotosSnowliftFeedback == null) {
                            var div_class_fbPhotoSnowliftContainer = findAncestor(span_id_fbPhotoSnowliftTimestamp, "fbPhotoSnowliftContainer");
                            div_class_fbPhotosSnowliftFeedback = div_class_fbPhotoSnowliftContainer.getElementsByClassName("fbPhotosSnowliftFeedback")[0];
                            console.log(div_class_fbPhotosSnowliftFeedback);
                            addControls(postlink, postid, pageid, div_class_fbPhotosSnowliftFeedback, "popup");
                        }
                    }
                }
            }
        }
    });
}

var Home_NewsFeed_observer = new MutationObserver(Main_NewsFeed_Callback);
var Home_feedstream2_Post_observer = new MutationObserver(Home_feedstream_Post_observer_Callback);
var Home_feedstream1_Post_observer = new MutationObserver(Home_feedstream_Post_observer_Callback);
var Facebook_Body_observer = new MutationObserver(Facebook_Body_Callback);
var Facebook_Popup_observer = new MutationObserver(Facebook_Popup_Callback);

Main();


function Main() {
	
    chrome.runtime.sendMessage({
        cookiename: "copyReaction"
    }, function(response) {
        if (response.copyReaction.toLowerCase() === "true") {
            copyReaction = true;
        } else if (response.copyReaction.toLowerCase() === "false") {
            copyReaction = false;
        }
    });

    chrome.runtime.sendMessage({
        cookiename: "reactionProtected"
    }, function(response) {
        if (response.reactionProtected.toLowerCase() === "true") {
            reactionProtected = true;
        } else if (response.reactionProtected.toLowerCase() === "false") {
            reactionProtected = false;
        }
    });
	
    chrome.runtime.sendMessage({
        cookiename: "nawaz"
    }, function(response) {
        token = response.token;
    });

    Facebook_Body_observer.observe(document.getElementsByTagName("body")[0], config);

    // news feed
    // main header of news feed all news is contained in this i.e contentArea except the page timeline
    var div_id_contentArea = document.getElementById("contentArea");
    var div_id_pagelet_timeline_main_column = document.getElementById("pagelet_timeline_main_column");

    if (div_id_contentArea != null) {

        var div_id_contentArea_children = div_id_contentArea.firstChild;

        if (div_id_contentArea_children.id == "stream_pagelet") {
            var div_id_main_stream = div_id_contentArea_children.lastChild;

            var isHomeNewsFeed = div_id_main_stream.id.match(/topnews_main_stream_/g);
            if (isHomeNewsFeed != null) {
                //in main news feed stream_pagelet has five children I need the last child that is the 4 index	
                Home_NewsFeed(div_id_main_stream);
            }
            var isFriendListNewsFeed = div_id_main_stream.id.match(/friendlist_main_stream_/g);
            if (isFriendListNewsFeed != null) {
                //FriendList_NewsFeed(div_id_main_stream);
            }
        } else if (div_id_contentArea_children.id == "pagelet_group_") {
            //Group_NewsFeed(div_id_contentArea_children);
        } else if (div_id_contentArea_children.id == "") {

            var div_id_browse_result_area = div_id_contentArea_children.lastChild;
            if (div_id_browse_result_area.id == "browse_result_area") {
                // TopSearch_NewsFeed(div_id_browse_result_area);
            }
        } else if (div_id_contentArea.getElementsByClassName("fbTimelineCapsule clearfix") != null ||
            div_id_contentArea.getElementsByClassName("fbTimelineCapsule") != null) {

            var div_class_fbTimelineCapsule = div_id_contentArea.getElementsByClassName("fbTimelineCapsule")[0];

            var div_class_5nb8 = div_class_fbTimelineCapsule.firstChild;

            var div_class_2t4u_clearfix = div_class_5nb8.getElementsByTagName("ol");

            var div_class_5pcb_4b0l = div_class_2t4u_clearfix[0].firstChild;

            var div_class_5pcb_4b0l_children = div_class_5pcb_4b0l.children;

            for (var i = 0; i < div_class_5pcb_4b0l_children.length; i++) {
                //OnePost(div_class_5pcb_4b0l_children[i]);
            }
            //UserTimeline_observer.observe(div_class_5nb8,config);
        }
    } else if (div_id_pagelet_timeline_main_column != null) {
        //Page_NewsFeed(div_id_pagelet_timeline_main_column);
    }
}

function Home_NewsFeed(topnewsMainStream) {

    var topnewsMainStreamChildren = topnewsMainStream.children;
    var feedstream = topnewsMainStreamChildren[0].children;
    // at start of the facebook newsfeed only two posts are loaded and all the rest posts are added to the third div

    NewPosts(feedstream[1]);
    Home_feedstream1_Post_observer.observe(feedstream[1], config);

    NewPosts(feedstream[2]);
    Home_feedstream2_Post_observer.observe(feedstream[2], config);

    if (((feedstream[3].children)[0] != null)) {
        //If the node is an element node, the nodeType property will return 1.
        if (((feedstream[3].children)[0]).nodeType === 1) {
            Home_NewsFeed_observer.observe((feedstream[3].children)[0], config);
        }
    }
}

function NewPosts(div_class_4ikz) {

    //check post type
    var div_class_none = div_class_4ikz.lastChild
        //if (div_class_none == null) return null;

    var div_id_u_jsonp_2_0 = div_class_none.lastChild
        //if (div_id_u_jsonp_2_0 == null) return null;

    var div_class_none2 = div_id_u_jsonp_2_0.lastChild
        //if (div_class_none2 == null) return null;

    var five_data_ft = div_class_none2.children;

    for (var i = 0; i < five_data_ft.length; i++) {

        // if two facebook posts are same it is added in a list (li) to look like one post
        if (five_data_ft[i].getElementsByTagName("ul").length == 1) {
            //two pages/users shared the same post
            TwoPosts(five_data_ft[i]);
        } else {
            OnePost(five_data_ft[i]);
        }
    }
}

function TwoPosts(one_data_ft) {
    var ul_class_uiList = one_data_ft.getElementsByTagName("UL");
    if (ul_class_uiList != null) {
        var ul_class_uiList_children = ul_class_uiList[0].children;
        for (var j = 0; j < ul_class_uiList_children.length; j++) {

            var div_class_userContentWrapper_5pcr = ul_class_uiList_children[j].getElementsByClassName("userContentWrapper _5pcr");

            var postid = getPostId("none", div_class_userContentWrapper_5pcr[0]);
            var postlink = getPostId("getpostlink", div_class_userContentWrapper_5pcr[0]);
            var pageid = getPageId(div_class_userContentWrapper_5pcr[0]);

            if (postid != null && pageid != null) {
                addControls(postlink, postid, pageid, div_class_userContentWrapper_5pcr[0], "nonpopup");
            }
        }
    } else {
        console.log(div_class_5pcr);
    }
}

function OnePost(one_data_ft) {
    var div_class_userContentWrapper_5pcr = one_data_ft.getElementsByClassName("userContentWrapper _5pcr");
    if (div_class_userContentWrapper_5pcr != null) {
        //normal posts
        if (div_class_userContentWrapper_5pcr.length == 1) {

            var postid = getPostId("none", div_class_userContentWrapper_5pcr[0]);
            var postlink = getPostId("getpostlink", div_class_userContentWrapper_5pcr[0]);
            var pageid = getPageId(div_class_userContentWrapper_5pcr[0]);

            if (postid != null && pageid != null) {
                addControls(postlink, postid, pageid, div_class_userContentWrapper_5pcr[0], "nonpopup");
            } else {
                console.log("null");
            }
        } else if (div_class_userContentWrapper_5pcr.length > 1) {
            //user liked,commented,reacted,suggested,sponsered etc
            var postid = getPostId("none", div_class_userContentWrapper_5pcr[1]);
            var postlink = getPostId("getpostlink", div_class_userContentWrapper_5pcr[1]);
            var pageid = getPageId(div_class_userContentWrapper_5pcr[1]);

            if (postid != null && pageid != null) {
                addControls(postlink, postid, pageid, div_class_userContentWrapper_5pcr[1], "nonpopup");
            } else {
                console.log("null");
            }
        }
    }
}

// The page id is stored in the image of the post user
function getPageId(div_class_userContentWrapper_5pcr) {
    if (div_class_userContentWrapper_5pcr == null) return null;
    var anchor_data_hovercard = div_class_userContentWrapper_5pcr.getElementsByClassName("_5pb8 _8o _8s lfloat _ohe");
    return Parse_PageId(anchor_data_hovercard[0]);
}

function Parse_PageId(anchor_data_hovercard) {

    if (anchor_data_hovercard == null) return null;

    var pageId = decodeURIComponent(anchor_data_hovercard.getAttribute("data-hovercard"));
    // data-hovercard="/ajax/hovercard/page.php?id=8062627951"
    if (pageId.includes("/ajax/hovercard/page.php?id=")) {
        // if the post is shared by the page

        var replaced = pageId.replace("/ajax/hovercard/page.php?id=", "");

        var arr = replaced.split('&');
        if (arr.length > 1) {
            return arr[0];
        } else {
            return replaced;
        }
    }
    // data-hovercard="/ajax/hovercard/user.php?id=8062627951"
    else if (pageId.includes("/ajax/hovercard/user.php?id=")) {

        // if the post is shared by a user 
        var replaced = pageId.replace("/ajax/hovercard/user.php?id=", "");

        var arr = replaced.split('&');
        if (arr.length > 1) {
            return arr[0];
        } else {
            return replaced;
        }
    } else {
        return null;
    }
}

// The post id is stored in the current time of the post. e.g (1 hr, 17 hr, 1 second etc )
function getPostId(type, div_class_userContentWrapper_5pcr) {

    if (div_class_userContentWrapper_5pcr == null) return null;
    var anchor_class_5pcq = div_class_userContentWrapper_5pcr.getElementsByClassName("_5pcq");
    if (type == "getpostlink") {
        return Parse_PostLink(anchor_class_5pcq[0]);
    } else {
        return Parse_PostId(anchor_class_5pcq[0]);
    }
}

function Parse_PostId(anchor_class_5pcq) {

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    if (anchor_class_5pcq == null) return null;

    var parse_anchor = document.createElement('a');
    parse_anchor.href = anchor_class_5pcq.getAttribute("href");


    // https://www.facebook.com/photo.php?fbid=10100939484711908&set=a.610151803738.2152893.713081&type=3
    // /antonantipovofficial/photos/a.355277937889521.83585.355022177915097/1093220400761934/?type=3
    //var anchor = '/antonantipovofficial/photos/a.355277937889521.83585.355022177915097/1093220400761934/?type=3'

    var arr = parse_anchor.href.replace('?', '/');
    arr = arr.replaceAll('&', '/')
    arr = arr.replaceAll('=', '/');
    arr = arr.replaceAll('https://www.facebook.com/', '')
    arr = arr.replaceAll('http://www.facebook.com/', '')
    arr = arr.replaceAll('//', '/')

    var arrr = arr.split('/');

    for (var i = 0; i < arrr.length; i++) {
        if (arrr[i].toLowerCase() == "fbid") {
            return arrr[i + 1];
        } else if (arrr[i].toLowerCase() == "posts") {
            return arrr[i + 1];
        } else if (arrr[i].toLowerCase() == "videos") {
            return arrr[i + 1];
        } else if (arrr[i].toLowerCase() == "photos") {
            return arrr[i + 2];
        } else if (i == 4) {
            return arrr[i];
        }
    }
}

function Parse_PostLink(anchor_class_5pcq) {

    if (anchor_class_5pcq == null) return null;

    var parse_anchor = document.createElement('a');
    parse_anchor.href = anchor_class_5pcq.getAttribute("href");

    //https://www.facebook.com/photo.php?fbid=10100939484711908&set=a.610151803738.2152893.713081&type=3

    return parse_anchor.href;
}

function addControls(postlink, postid, pageid, div_class_userContentWrapper_5pcr, flow) {

    // This contains two div the first is view of user reactions i.e reaction icons 
    // The second div is for comment share and like 
    //var form_async = div_class_userContentWrapper_5pcr.getElementsByTagName("FORM");
    var div_class_42nr = div_class_userContentWrapper_5pcr.getElementsByClassName("_42nr");

    if (flow == "nonpopup") {
        if (div_class_42nr[0] == null) return null;
        // the div with the class _42nr contains all the reaction (comments,like,love,haha,angry,wow,sad,share)
        var div_class_42nr_children = div_class_42nr[0].children;

        for (var i = 0; i < div_class_42nr_children.length; i++) {
            var span_class_none = div_class_42nr_children[i];
            var div_class_khz = span_class_none.firstChild;
            if (div_class_khz.className == "_khz") {
                if (reactionProtected) {
                    span_class_none.innerHTML = "";
                    addProtectedReactions(postlink, postid, pageid, span_class_none, div_class_userContentWrapper_5pcr);
                    if (span_class_none.querySelector("img") == null) {
                        addProtectedButton(span_class_none);
                    }
                } else if (copyReaction) {
                    appendLike(postlink, postid, pageid, div_class_khz, div_class_userContentWrapper_5pcr);
                    var span_check = div_class_khz.getElementsByClassName("accessible_elem");
                    if (span_check[0] == null) {
                        var div_class_iu_ = div_class_khz.getElementsByClassName("_iu-");
                        appendReactions(postlink, postid, pageid, div_class_iu_[0], div_class_userContentWrapper_5pcr);
                    }
                    if (div_class_khz.querySelector("img") == null) {
                        addRecordButton(div_class_khz);
                    }
                }
                if (div_class_khz.querySelector("#hdn_pageid_postid") == null) {
                    addHiddenInput(postlink, pageid, postid, div_class_khz);
                }
            }
        }
    }
    // check if the newly added button already exists or not
    // if not exists add a new button
    addSaveButton(postlink, postid, pageid, div_class_42nr[0], div_class_userContentWrapper_5pcr, flow);
}


// adding this function to add hidden input if we will use it if we append the reactions in facebook
function addHiddenInput(postlink, pageid, postid, div_class_khz) {
    var hdninput = document.createElement("input");
    hdninput.type = "hidden";
    hdninput.id = "hdn_pageid_postid";
    hdninput.name = "hdn_pageid_postid";
    hdninput.value = pageid + "_" + postid + "_" + encodeURIComponent(postlink);
    div_class_khz.appendChild(hdninput);
}

function addRecordButton(div_class_khz) {
    var recordimg = document.createElement("img");
    recordimg.src = chrome.extension.getURL("images/RecordButton.png");
    recordimg.style.width = "15px";
    recordimg.style.height = "15px";
    recordimg.title = "Recording Reactions";
    div_class_khz.insertBefore(recordimg, div_class_khz.firstChild);
}

function addProtectedButton(div_class_khz) {
    var recordimg = document.createElement("img");
    recordimg.src = chrome.extension.getURL("images/Protection.png");
    recordimg.style.width = "15px";
    recordimg.style.height = "15px";
    recordimg.title = "Protected Reactions";
    var span_class_likebtn = div_class_khz.firstChild;
    span_class_likebtn.insertBefore(recordimg, span_class_likebtn.children[1]);
}

function appendLike(postlink, postid, pageid, div_class_khz, div_class_userContentWrapper_5pcr) {
    var anchor_class_UFILikeLink_4x9_4x9_48k = div_class_khz.getElementsByClassName("UFILikeLink _4x9- _4x9_ _48-k");
    anchor_class_UFILikeLink_4x9_4x9_48k[0].addEventListener("click", function() {
        console.log("undo_do_like");
        $.ajax({
            url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=undo_do_like&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
            jsonp: false,
            success: function(result, textStatus, xhr) {
                if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                    console.log("Saved");
                }
                console.log(result);
            },
            error: function(result, textStatus, xhr) {
                if (String(result.status) === '401') {
                    alert("Not Logged In :( ");
                } else if (String(result.status) === '500') {
                    alert("Error :( ");
                } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                    checkShared(div_class_userContentWrapper_5pcr, "undo_do_like");
                }
                console.log(result);
            }
        });
    });
}

function appendReactions(postlink, postid, pageid, div_class_iu_, div_class_userContentWrapper_5pcr) {

    var div_class_iu_children = div_class_iu_.children

    for (var i = 0; i < div_class_iu_children.length; i++) {
        var span_class_iuw = div_class_iu_children[i];
        if (span_class_iuw.getAttribute("aria-label").toLowerCase() == 'like') {
            span_class_iuw.addEventListener("click", function() {
                console.log("Like");
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=like&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "like");
                        }
                        console.log(result);
                    }
                });
            });
        } else if (span_class_iuw.getAttribute("aria-label").toLowerCase() == 'love') {
            span_class_iuw.addEventListener("click", function() {
                console.log('Love');
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=love&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "love");
                        }
                        console.log(result);
                    }
                });

            });
        } else if (span_class_iuw.getAttribute("aria-label").toLowerCase() == "haha") {
            span_class_iuw.addEventListener("click", function() {
                console.log('Haha');
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=haha&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "haha");
                        }
                        console.log(result);
                    }
                });
            });
        } else if (span_class_iuw.getAttribute("aria-label").toLowerCase() == "wow") {
            span_class_iuw.addEventListener("click", function() {
                console.log('Wow ');
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=wow&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "wow");
                        }
                        console.log(result);
                    }
                });
            });
        } else if (span_class_iuw.getAttribute("aria-label").toLowerCase() == "sad") {
            span_class_iuw.addEventListener("click", function() {
                console.log('Sad ');
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=sad&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "sad");
                        }
                        console.log(result);
                    }
                });
            });
        } else if (span_class_iuw.getAttribute("aria-label").toLowerCase() == "angry") {
            span_class_iuw.addEventListener("click", function() {
                console.log('Angry = ');
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=angry&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            console.log("Saved");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, "angry");
                        }
                        console.log(result);
                    }
                });
            });
        }
        span_class_iuw = null;
    }
}

function getCreatedTime(div_class_userContentWrapper_5pcr) {

    //console.log(div_class_userContentWrapper_5pcr.getElementsByTagName("abbr"));
    var abbr_class_5ptz_array = div_class_userContentWrapper_5pcr.getElementsByTagName("abbr");
    //if(abbr_class_5ptz_array.length == 1){
    var abbr_class_5ptz = abbr_class_5ptz_array[0];
    return abbr_class_5ptz.getAttribute("title");
    //}
    // when the post is shared it has two time just get the first time
    //else if(abbr_class_5ptz_array.length == 2){
    //	var abbr_class_5ptz = abbr_class_5ptz_array[0];
    //	return abbr_class_5ptz.getAttribute("title");
    //}
}

function getMessage(div_class_userContentWrapper_5pcr) {

    var div_class_5pbx_userContent_array = div_class_userContentWrapper_5pcr.getElementsByClassName("_5pbx userContent");

    if (div_class_5pbx_userContent_array.length == 1) {
        var message = String(div_class_5pbx_userContent_array[0].innerHTML);
        message = message.replace("<p>", "");
        message = message.replace("</p>", "\n");
        // remove all html
        return message.replace(/(<([^>]+)>)/ig, "");
    } else {
        console.log("no message or two message ???");
        return null;
    }
}

function getLink(div_class_userContentWrapper_5pcr) {
    var div_class_6ks_array = div_class_userContentWrapper_5pcr.getElementsByClassName("_6ks");

    if (div_class_6ks_array.length == 1) {
        var anchor_class_none = div_class_6ks_array[0].firstChild;
        return anchor_class_none.getAttribute("href");
    } else {
        console.log("no link or two link ???");
        return null;
    }
}

function getDescription(div_class_userContentWrapper_5pcr) {

    var div_class_mtm_5pco_array = div_class_userContentWrapper_5pcr.getElementsByClassName("mtm _5pco");

    // remove all html
    if (div_class_mtm_5pco_array.length == 1) {
        var description = String(div_class_mtm_5pco_array[0].innerHTML);
        description = description.replace("<p>", "");
        description = description.replace("</p>", "\n");

        // remove all html
        return description.replace(/(<([^>]+)>)/ig, "");
    } else {
        console.log("no description or two description ???");
        return null;
    }
}


function getPhoto(div_class_userContentWrapper_5pcr, flow) {
    if (flow === "popup") {
        var img_class = div_class_userContentWrapper_5pcr.getElementsByTagName("img");
        if (img_class[0] == null) return null;
        return img_class[0].getAttribute("src");
    } else if (flow === "nonppopup") {
        var div_class_1dwg_1w_m = div_class_userContentWrapper_5pcr.firstChild;
        var div_class_3x_2 = div_class_1dwg_1w_m.lastChild;
        var img_class = div_class_3x_2.getElementsByTagName("img");

        if (img_class[0] == null) return null;
        return img_class[0].getAttribute("src");
    }
}

function getStatus(div_class_userContentWrapper_5pcr) {

    var div_class_1dwg_1w_m = div_class_userContentWrapper_5pcr.firstChild;

    var status = div_class_1dwg_1w_m.getElementsByClassName("_5pbx userContent");

    if (status[0] == null) return null;
    return status[0].innerHTML.replace(/(<([^>]+)>)/ig, "");
    //return status[0].innerHTML
}

function checkShared(div_class_userContentWrapper_5pcr, collection) {

    var span_class_fcg = div_class_userContentWrapper_5pcr.getElementsByClassName("fwn fcg");
    var arr = span_class_fcg[0].getElementsByTagName("a");

    var postid = "";
    var pageid = "";
    var postlink = "";
    var story = "";

    // Sophia Emma shared Techcrunch's post.
    if (arr.length == 3) {
        pageid = Parse_PageId(arr[1]);
        postid = Parse_PostId(arr[2]);
        postlink = getPostLink(div_class_userContentWrapper_5pcr);
        story = arr[0].innerText + " Shared " + arr[1].innerText + "'s " + arr[2].innerText;
    }
    // Sophia Emma shared her post. 
    else if (arr.length == 2) {
        pageid = Parse_PageId(arr[0]);
        postid = Parse_PostId(arr[1]);
        postlink = getPostLink(div_class_userContentWrapper_5pcr);
        story = arr[0].innerText + " Shared " + arr[1].innerText;
    } // Sophia Emma 
    else if (arr.length == 1) {
        pageid = Parse_PageId(arr[0]);
        postid = getPostId("test", div_class_userContentWrapper_5pcr);
        postlink = getPostLink(div_class_userContentWrapper_5pcr);
    }

    $.ajax({
        url: domain + "api/WatchLater?postlink=" + encodeURIComponent(postlink) + "&postid=" + postid + "&pageid=" + pageid + "&collection=" + collection + "&token=" + token + "&story=" + encodeURIComponent(story),
        jsonp: false,
        success: function(result, textStatus, xhr) {
            if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                console.log("Saved");
            }
        },
        error: function(result, textStatus, xhr) {
            console.log(result);
            if (String(result.status) === '401') {
                alert("Not Logged In :( ");
            } else if (String(result.status) === '500') {
                alert("Error :( ");
            } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                download_privateData(postlink, postid, pageid, div_class_userContentWrapper_5pcr, collection);
            }
        }
    });
}

function getVideo(div_class_userContentWrapper_5pcr) {

    var video_tag_array = div_class_userContentWrapper_5pcr.getElementsByTagName("video");

    if (video_tag_array[0] == null) return null;
    var div_class_ox1_swfObject = video_tag_array[0].firstChild;

    var embed_tag = div_class_ox1_swfObject.firstChild;

    var attr_flashvars = embed_tag.getAttribute("flashvars")

    var attr_flashvars_decoded = unescape(attr_flashvars)

    var attr_flashvars_replaced = attr_flashvars_decoded.replace("params=", "");

    var remove_string = "";

    for (var i = attr_flashvars_replaced.length; i > 0; i--) {
        if (attr_flashvars_replaced[i] == '}') {
            remove_string = attr_flashvars_replaced.substring(i + 1, attr_flashvars_replaced.length)
            break;
        }
    }
    attr_flashvars_replaced = attr_flashvars_replaced.replace(remove_string, "");

    var json_obj = JSON.parse(attr_flashvars_replaced);

    if (json_obj.video_data.progressive.hd_src != null) {
        return json_obj.video_data.progressive.hd_src;
    } else if (json_obj.video_data.progressive.hd_src_no_ratelimit != null) {
        return json_obj.video_data.progressive.hd_src_no_ratelimit;
    } else if (json_obj.video_data.progressive.sd_src) {
        return json_obj.video_data.progressive.sd_src;
    } else if (json_obj.video_data.progressive.sd_src_no_ratelimit) {
        return json_obj.video_data.progressive.sd_src_no_ratelimit;
    }
    return null;
}

function getPostLink(div_class_userContentWrapper_5pcr) {

    var div_class_5x46 = div_class_userContentWrapper_5pcr.querySelector("._5x46");
    var div_class_5va3 = div_class_5x46.lastChild;
    //if (div_class_5va3 != null) return null;

    var div_class_42ef = div_class_5va3.lastChild;
    //if (_42ef == null) return null;

    var div_class_5va4 = div_class_42ef.lastChild;
    //if (div_class_5va4 == null) return null;

    var div_class_ = div_class_5va4.lastChild;

    var div_class_6a_5u5j = div_class_.lastChild;
    //if (div_class_6a_5u5j == null) return null;

    var div_class_6a_5u5j_6b = div_class_6a_5u5j.lastChild;
    // if (div_class_6a_5u5j_6b == null) return null;

    var div_class_5pcp = div_class_6a_5u5j_6b.lastChild;

    var span_class_none = div_class_5pcp.firstChild;

    var span_class_fsmfwnfcg = span_class_none.lastChild;

    var anchor_class_5pcq = span_class_fsmfwnfcg.lastChild;
    return anchor_class_5pcq.getAttribute("href");

}

function addSaveButton(postlink, postid, pageid, div_class_42nr, div_class_userContentWrapper_5pcr, flow) {

    if (div_class_42nr.querySelector("#kino") == null) {

        var newItem = document.createElement("span"); // Create a <li> node
        newItem.className = "tooltip";

        var div_tooltip = document.createElement("div");
        div_tooltip.className = "tooltiptext";
        div_tooltip.innerText = "Save this";
        newItem.appendChild(div_tooltip);

        var dropdown = document.createElement("div");
        dropdown.style.display = "inline-block";
        dropdown.id = "kino";

        var link2 = document.createElement("a");

        link2.addEventListener("click", function() {
            $.ajax({
                url: domain + "api/WatchLater?postlink=" + encodeURIComponent(postlink) + "&postid=" + postid + "&pageid=" + pageid + "&collection=save&token=" + token,
                jsonp: false,
                success: function(result, textStatus, xhr) {
                    if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                        console.log("Saved");
                    }
                    console.log(result);
                },
                error: function(result, textStatus, xhr) {
                    var res = JSON.parse(result.responseText);
                    if (String(result.status) === '401') {
                        alert("Not Logged In :( ");
                    } else if (String(result.status) === '500') {
                        alert("Error :( ");
                    } else if (String(result.status) === '400' || res.Message === 'private') {
                        if (flow === "popup") {
                            var div_class_fbPhotoSnowliftContainer = document.getElementsByClassName("fbPhotoSnowliftContainer");
                            download_Popup_Private_Data(postlink, postid, pageid, "save", div_class_fbPhotoSnowliftContainer[0]);
                        } else {
                            checkShared(div_class_userContentWrapper_5pcr, "save");
                        }
                    }
                }
            });
        });

        var img = document.createElement('img');
        img.src = chrome.extension.getURL("images/saved.png");
        img.style.width = "20px";
        img.style.height = "20px";

        link2.appendChild(img);
        dropdown.appendChild(link2);
        newItem.appendChild(dropdown);
        div_class_42nr.appendChild(newItem);
    }
}

function download_Popup_Private_Data(postlink, postid, pageid, collection, div_class_fbPhotoSnowliftContainer) {

    var created_time = getCreatedTime(div_class_fbPhotoSnowliftContainer);
    var message = getMessage(div_class_fbPhotoSnowliftContainer);
    var description = getDescription(div_class_fbPhotoSnowliftContainer);
    var link = getLink(div_class_fbPhotoSnowliftContainer);
    var source = getVideo(div_class_fbPhotoSnowliftContainer);
    var status = getStatus(div_class_fbPhotoSnowliftContainer);
    var type = "";

    var fullpicture = getPhoto(div_class_fbPhotoSnowliftContainer, "popup");

    // console.log("created_time");
    // console.log(created_time);

    // console.log("message");
    // console.log(message);

    // console.log("description");
    // console.log(description);

    // console.log("source");
    // console.log(source);

    // console.log("status");
    // console.log(status);

    // console.log("postid");
    // console.log(postid);

    // console.log("pageid");
    // console.log(pageid);

    if (source != null) {
        type = "video";
       // console.log("video");
       // console.log(encodeURIComponent(source));
    } else if (link != null) {
        type = "link";
       // console.log("Link");
      //  console.log(link);
    } else if (status != null) {
        type = "status";
      //  console.log("status");
       // console.log(message);
    } else if (fullpicture != null) {
       // console.log("photo");
        type = "photo";
       // console.log(fullpicture);
       // console.log(encodeURIComponent(fullpicture));
    }

    $.ajax({
        url: domain + "api/TheContent?postid=" + postid + "&pageid=" + pageid + "&collection=" + collection + "&createdTime=" + created_time + "&message=" + encodeURIComponent(message) + "&linkurl=" + encodeURIComponent(link) + "&type=" + type + "&fullpicture=" + encodeURIComponent(fullpicture) + "&description=" + encodeURIComponent(description) + "&source=" + encodeURIComponent(source) + "&postLink=" + encodeURIComponent(postlink) + "&token=" + token,
        jsonp: false,
        type: "post",
        success: function(result, textStatus, xhr) {
            console.log(result);
            if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                return true;
            }
            return false;
        },
        error: function(result, textStatus, xhr) {
            return false;
        }
    });
}

function download_privateData(postlink, postid, pageid, div_class_userContentWrapper_5pcr, collection) {

    var created_time = getCreatedTime(div_class_userContentWrapper_5pcr);
    var message = getMessage(div_class_userContentWrapper_5pcr);
    var description = getDescription(div_class_userContentWrapper_5pcr);
    var link = getLink(div_class_userContentWrapper_5pcr);
    var source = getVideo(div_class_userContentWrapper_5pcr);
    var status = getStatus(div_class_userContentWrapper_5pcr);
    var type = "";

    var fullpicture = getPhoto(div_class_userContentWrapper_5pcr, "nonpopup");

    // console.log(created_time);
    // console.log(message);
    // console.log(description);
    // console.log(source);
    // console.log(status);
    // console.log(postid);
    // console.log(pageid);

    if (source != null) {
        type = "video";
      //  console.log("video");
      //  console.log(encodeURIComponent(source));
    } else if (link != null) {
        type = "link";
     //   console.log("Link");
     //   console.log(link);
    } else if (status != null) {
        type = "status";
     //   console.log("status");
     //   console.log(message);
    } else if (fullpicture != null) {
     //   console.log("photo");
        type = "photo";
     //   console.log(fullpicture);
     //   console.log(encodeURIComponent(fullpicture));
    }

    $.ajax({
        url: domain + "api/TheContent?postid=" + postid + "&pageid=" + pageid + "&collection=" + collection + "&createdTime=" + created_time + "&message=" + encodeURIComponent(message) + "&linkurl=" + encodeURIComponent(link) + "&type=" + type + "&fullpicture=" + encodeURIComponent(fullpicture) + "&description=" + encodeURIComponent(description) + "&source=" + encodeURIComponent(source) + "&postLink=" + encodeURIComponent(postlink) + "&token=" + token,
        jsonp: false,
        type: "post",
        success: function(result, textStatus, xhr) {
            console.log(result);
            if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                return true;
            }
            return false;
        },
        error: function(result, textStatus, xhr) {
            return false;
        }
    });

}

function addProtectedReactions(postlink, postid, pageid, span_class_none, div_class_userContentWrapper_5pcr) {

    var div_class_facebook_reaction = document.createElement("div")
    div_class_facebook_reaction.className = "facebook-reaction";

    var span_class_likebtn = document.createElement("span");
    span_class_likebtn.className = "like-btn";

    var span_class_like_btn_emolike_btn_default = document.createElement("span");
    span_class_like_btn_emolike_btn_default.className = "like-btn-emo like-btn-default";

    var span_class_like_btn_text = document.createElement("span");
    span_class_like_btn_text.className = "like-btn-text";
    span_class_like_btn_text.innerText = "Like";

    // Undo the facebook reactions
    span_class_like_btn_text.addEventListener("click", function() {
        $.ajax({
            url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=undo_do_like&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
            jsonp: false,
            success: function(result, textStatus, xhr) {
                if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                    if ($(span_class_like_btn_text).hasClass("active")) {
                        $(".like-btn-text").text("Like").removeClass().addClass('like-btn-text');
                        $(".like-btn-emo").removeClass().addClass('like-btn-emo').addClass("like-btn-default");
                    }
                }
                console.log(result);
            },
            error: function(result, textStatus, xhr) {
                if (String(result.status) === '401') {
                    alert("Not Logged In :( ");
                } else if (String(result.status) === '500') {
                    alert("Error :( ");
                } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                    checkShared(div_class_userContentWrapper_5pcr, "undo_do_like");
                }
                console.log(result);
            }
        });
    });

    span_class_likebtn.appendChild(span_class_like_btn_emolike_btn_default);
    span_class_likebtn.appendChild(span_class_like_btn_text);

    var ul_class_reactionsbox = document.createElement("ul");
    ul_class_reactionsbox.className = "reactions-box";

    var rect = ["Like", "Love", "Haha", "Wow", "Sad", "Angry"];
    for (var i = 0; i < rect.length; i++) {
        (function() {

            var li_class_reactionreactionlike = document.createElement("li");
            li_class_reactionreactionlike.className = "reaction reaction-" + rect[i].toLowerCase();

            var attr_data_reaction = document.createAttribute("data-reaction");
            attr_data_reaction.value = rect[i];
            li_class_reactionreactionlike.setAttributeNode(attr_data_reaction);
            var data_reaction = li_class_reactionreactionlike.getAttribute("data-reaction");

            // when the user clicks any facebook reactions
            li_class_reactionreactionlike.addEventListener("click", function() {
                $.ajax({
                    url: domain + "api/WatchLater?postid=" + postid + "&pageid=" + pageid + "&collection=" + data_reaction.toLowerCase() + "&postlink=" + encodeURIComponent(postlink) + "&token=" + token,
                    jsonp: false,
                    success: function(result, textStatus, xhr) {
                        if (String(xhr.status) === '200' && result.Message === 'Successfull') {
                            $(span_class_like_btn_text).text(data_reaction)
                                .removeClass()
                                .addClass('like-btn-text')
                                .addClass('like-btn-text-' + data_reaction.toLowerCase())
                                .addClass("active");
                        }
                        console.log(result);
                    },
                    error: function(result, textStatus, xhr) {
                        if (String(result.status) === '401') {
                            alert("Not Logged In :( ");
                        } else if (String(result.status) === '500') {
                            alert("Error :( ");
                        } else if (String(result.status) === '400' || result.responseText.Message === 'private') {
                            checkShared(div_class_userContentWrapper_5pcr, data_reaction.toLowerCase());
                        }
                        console.log(result);
                    }
                });
            });
            ul_class_reactionsbox.appendChild(li_class_reactionreactionlike);
        }()); // immediate invocation
    }
    span_class_likebtn.appendChild(ul_class_reactionsbox);
    span_class_none.appendChild(span_class_likebtn);
}