// constants 
const validNameRegex = /[.\-]/g;
// required arrays and vars
var tabs = []; // array of objects
var users = []; // array of users and their ids for tell user
var chatId = 2; 
// world input field (the add button is at the end)
let worldInput = document.createElement("input");
worldInput.type = "text";
worldInput.id = "world_input_field";
worldInput.size = 6;
worldInput.placeholder = "world";
elm.chat_global_tab.after(worldInput);
let addBtn = document.createElement("button");
addBtn.textContent = "+";
worldInput.after(addBtn);
let removeBtn = document.createElement("button");
removeBtn.textContent = "-";
worldInput.after(removeBtn);

// functions
function nct(inputElm) {
    newChatTab(inputElm.value);
    inputElm.value = "";
}

function rct(inputElm) {
    removeChatTab(inputElm.value);
    inputElm.value = "";
}

if (typeof onNewChatTab() !== "function") { 
    function onNewChatTab() {
        // custom code runs here for easy cross-script implementation
        return;
    }
}

function newChatTab(world2add) {
    let match = world2add.match(/[a-zA-Z._-]+/g);
    if (!match) {
        console.error("Invalid world name.");
        return;
    }
    let world = match[0];
    let sworld = validVarName(world);
    let new_socket = new ReconnectingWebSocket(`wss://ourworldoftext.com/${world}/ws/`);
    elm.chat_page_tab.style.minWidth = "80px";
    if (state.worldModel.no_chat_global) {
        elm.chat_upper.style.textAlign = "";
        elm.chat_page_tab.style.display = "";
        elm.usr_online.style.paddingLeft = "";
    }
    let new_chatTab = document.createElement("div");
    new_chatTab.innerText = `/${world}`;
    new_chatTab.classList.add("chat_tab_button");
    new_chatTab.style.minWidth = `${9 * (world.length + 1)}px`;
    new_chatTab.id = `chat_${sworld}_tab`;
    elm[`$chat_${sworld}_tab`] = new_chatTab;
    addBtn.after(new_chatTab);

    let new_chatfield = document.createElement("div");
    new_chatfield.classList.add("chatfield");
    new_chatfield.style.display = "none";
    new_chatfield.id = `${sworld}_chatfield`; // FIX: wrong assignment before
    elm[`${sworld}_chatfield`] = new_chatfield;
    elm.global_chatfield.after(new_chatfield);

    let new_unreadText = document.createElement("b");
    new_unreadText.classList.add("unread");
    new_unreadText.id = `${sworld}_unread`;
    elm[`${sworld}_unread`] = new_unreadText;
    new_chatTab.append(new_unreadText);
    
    let tabObject = {
        id: chatId,
        socket: new_socket,
        world: world,
        sanitizedName: sworld,
        chatAdditions: [],
        chatUnread: 0,
        tabOpen: false,
        usersOnline: 0,
    };

    new_chatTab.addEventListener("click", () => {
        // hide all chatfields
        elm.chat_page_tab.classList.remove("chat_tab_selected");
        elm.chat_global_tab.classList.remove("chat_tab_selected");
        tabs.forEach(t => {
            let cf = document.getElementById(`${t.sanitizedName}_chatfield`);
            if (cf) cf.style.display = "none";

            let tabEl = document.getElementById(`chat_${t.sanitizedName}_tab`);
            if (tabEl) tabEl.classList.remove("chat_tab_selected");
        });
        elm.page_chatfield.style.display = "none";
        elm.global_chatfield.style.display = "none";
        // show this tab’s chatfield
        new_chatfield.style.display = "";
        new_chatTab.classList.add("chat_tab_selected");
        
        // update global vars if you use them
        selectedChatTab = tabObject.id;
        tabObject.chatUnread = 0;
        insertNewChatElementsIntoChatfield(document.getElementById(`${sworld}_chatfield`), findBySName(sworld).chatAdditions);
        updateUnread(tabObject.world);
        updateUserCount(findByName(world));
    });

    new_socket.onopen = function(){
	    new_socket.send(`{"kind":"chathistory"}`);
        new_socket.send(`{"kind":"user_count"}`);
    }
    
    new_socket.onmessage = function(msg) {
        let data = JSON.parse(msg.data);

        if (data.kind == "chathistory") {
            w_onhistory(data, world);
        } else if (data.kind == "chat") {
            if (data.location != "page") return;

            if (!(chatOpen && selectedChatTab == findByName(world).id)) {
                ++findByName(world).chatUnread;
                updateUnread(world);
            }

            data.type = chatType(data.registered, data.nickname, data.realUsername);
            w_addChat(data.id, data.type, data.nickname, data.message, data.realUsername,
                      data.op, data.admin, data.staff, data.color, data.date || Date.now(), data.dataObj, world);
        } else if (data.kind == "user_count") {
            findByName(world).usersOnline = data.count;
        }
    };

    tabs.push(tabObject);
    chatId++;
    if (typeof onNewChatTab === "function") onNewChatTab(tabObject);
}

function removeChatTab(name) {
    let world = findByName(name);
    document.getElementById(`${world.sanitizedName}_chatfield`).remove();
    document.getElementById(`${world.sanitizedName}_unread`).remove();
    document.getElementById(`chat_${world.sanitizedName}_tab`).remove();
    tabs.splice(tabs.indexOf(world),1);
}

function validVarName(xname) {
    let vname = xname.replace(validNameRegex, "_"); // FIX: no loop needed
    return "W" + vname;
}

function findByName(name2find) {
    return tabs.find(({ world }) => world === name2find);
}
function findBySName(name2find) {
    return tabs.find(({ sanitizedName }) => sanitizedName === name2find);
}
function findById(id2find) {
    return tabs.find(({ id }) => id === id2find);
}

function w_addChat(id, type, nickname, message, realUsername, op, admin, staff, color, date, dataObj, page) {
    let spage = validVarName(page);
    if (!dataObj) dataObj = {};
    if (!message) message = "";
    if (!realUsername) realUsername = "";
    if (!nickname) nickname = realUsername;
    if (!color) color = assignColor(nickname);
    var msgData = {
        id, type, nickname, message, realUsername, op, admin, staff, color, date, dataObj
    };
    let worldTab = findByName(page);
    worldTab.chatAdditions.push(msgData);
    if (worldTab.chatAdditions.length > chatHistoryLimit) {
        worldTab.chatAdditions.shift(); // FIX: reference worldTab
    }
    insertNewChatElementsIntoChatfield(document.getElementById(`${worldTab.sanitizedName}_chatfield`), worldTab.chatAdditions);
}

function w_onhistory(data, page) {
    w.emit("chathistory", data);
    var page_prev = data.page_chat_prev;
    console.log(page_prev);
    for (var p = 0; p < page_prev.length; p++) {
        var chat = page_prev[p];
        if (chat.hide) continue;
        var type = chatType(chat.registered, chat.nickname, chat.realUsername);
        w_addChat(chat.id, type, chat.nickname, chat.message, chat.realUsername,
                  chat.op, chat.admin, chat.staff, chat.color, chat.date, chat, page);
    }
}

function updateUserCount(world = null) {
	if (world) {var count = world.usersOnline} else {var count = w.userCount}
	if(count == void 0) {
		elm.usr_online.innerText = "";
		return;
	}
	var unit = "user";
	var units = "users";
	var current_unit;
	if(count == 1) {
		current_unit = unit;
	} else {
		current_unit = units;
	}
	elm.usr_online.innerText = count + " " + current_unit + " online";
}

// removing vanilla event listeners
elm.chatsend.removeEventListener("click", function() {sendChat();});

elm.chat_page_tab.removeEventListener("click", function() {
	elm.chat_page_tab.classList.add("chat_tab_selected");
	elm.chat_global_tab.classList.remove("chat_tab_selected");

	elm.global_chatfield.style.display = "none";
	elm.page_chatfield.style.display = "";
	selectedChatTab = 0;
	chatPageUnread = 0;

	insertNewChatElements();
	updateUnread();
	if(!initPageTabOpen) {
		initPageTabOpen = true;
		elm.page_chatfield.scrollTop = elm.page_chatfield.scrollHeight;
	}
});

elm.chat_global_tab.removeEventListener("click", function() {
	elm.chat_global_tab.classList.add("chat_tab_selected");
	elm.chat_page_tab.classList.remove("chat_tab_selected");

	elm.global_chatfield.style.display = "";
	elm.page_chatfield.style.display = "none";
	selectedChatTab = 1;
	chatGlobalUnread = 0;

	insertNewChatElements();
	updateUnread();
	if(!initGlobalTabOpen) {
		initGlobalTabOpen = true;
		elm.global_chatfield.scrollTop = elm.global_chatfield.scrollHeight;
	}
});

// adding new event listeners
elm.chatsend.addEventListener("click", function() {
	sendChat();
});

elm.chat_page_tab.addEventListener("click", function() {
	elm.chat_page_tab.classList.add("chat_tab_selected");
	elm.chat_global_tab.classList.remove("chat_tab_selected");
    tabs.forEach(t => {
        let cf = document.getElementById(`${t.sanitizedName}_chatfield`);
        if (cf) cf.style.display = "none";

        let tabEl = document.getElementById(`chat_${t.sanitizedName}_tab`);
        if (tabEl) tabEl.classList.remove("chat_tab_selected");
    });    
	elm.global_chatfield.style.display = "none";
	elm.page_chatfield.style.display = "";
	selectedChatTab = 0;
	chatPageUnread = 0;

	insertNewChatElements();
	updateUnread();
    updateUserCount();
	if(!initPageTabOpen) {
		initPageTabOpen = true;
		elm.page_chatfield.scrollTop = elm.page_chatfield.scrollHeight;
	}
});

elm.chat_global_tab.addEventListener("click", function() {
	elm.chat_global_tab.classList.add("chat_tab_selected");
	elm.chat_page_tab.classList.remove("chat_tab_selected");
    tabs.forEach(t => {
        let cf = document.getElementById(`${t.sanitizedName}_chatfield`);
        if (cf) cf.style.display = "none";

        let tabEl = document.getElementById(`chat_${t.sanitizedName}_tab`);
        if (tabEl) tabEl.classList.remove("chat_tab_selected");
    });   
	elm.global_chatfield.style.display = "";
	elm.page_chatfield.style.display = "none";
	selectedChatTab = 1;
	chatGlobalUnread = 0;
    
	insertNewChatElements();
	updateUnread();
    updateUserCount();
	if(!initGlobalTabOpen) {
		initGlobalTabOpen = true;
		elm.global_chatfield.scrollTop = elm.global_chatfield.scrollHeight;
	}
});

sendChat = function() {
    var chatText = elm.chatbar.value;
    elm.chatbar.value = "";
    var opts = {};
    switch (selectedChatTab) {
        case 0:
            opts.location = "page";
            break;
        case 1:
            opts.location = "global";
            break;
        default:
            opts.location = findById(selectedChatTab).sanitizedName;
    }
    if (defaultChatColor != null) {
        opts.color = "#" + ("00000" + defaultChatColor.toString(16)).slice(-6);
    }
    api_chat_send(chatText, opts);
};

network.chat = function(message, location, nickname, color, customMeta) {
    let data = {
        kind: "chat",
        nickname,
        message,
        location,
        color,
        customMeta
    };
    if (location !== "page" && location !== "global") {
        findBySName(location).socket.send(JSON.stringify(data));
    } else {
        network.transmit(data);
    }
};

function updateUnread(wpage) {
    var total = elm.total_unread;
    var page = elm.page_unread;
    var global = elm.global_unread;
    let thisWorld = findByName(wpage);
    if (!thisWorld) return;
    let thisWorldUnread = thisWorld.chatUnread;
    var totCstm = 0;
    tabs.forEach(elem => {
        totCstm += elem.chatUnread;
    });
    var totalCount = chatPageUnread + chatGlobalUnread + totCstm;
    total.style.display = "none";
    global.style.display = "none";
    page.style.display = "none";
    let world = elm[`${validVarName(wpage)}_unread`];
    if (world) world.style.display = "none";

    if (totalCount) {
        total.style.display = "";
        total.innerText = totalCount > 1000 ? "1k+" : "(" + totalCount + ")";
    }
    if (chatOpen) {
        if (chatPageUnread) {
            page.style.display = "";
            page.innerText = chatPageUnread > 1000 ? "1k+" : "(" + chatPageUnread + ")";
        }
        if (chatGlobalUnread) {
            global.style.display = "";
            global.innerText = chatGlobalUnread > 1000 ? "1k+" : "(" + chatGlobalUnread + ")";
        }
        if (thisWorldUnread && world) {
            world.style.display = "";
            world.innerText = thisWorldUnread > 1000 ? "1k+" : "(" + thisWorldUnread + ")";
        }
    }
}

// add button behaviour
addBtn.onclick = () => nct(document.getElementById("world_input_field"));
removeBtn.onclick = () => rct(document.getElementById("world_input_field"));