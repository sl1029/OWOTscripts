// ==UserScript==
// @name         OWOT Dark Blue Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       katiserie
// @match        https://ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // font imports
    var link2 = document.createElement('link');
    link2.setAttribute('rel', 'stylesheet');
    link2.setAttribute('type', 'text/css');
    link2.setAttribute('href', 'https://fonts.googleapis.com/css?family=Lato:400');
    document.head.appendChild(link2);
    // menu changes
    for (let child of document.getElementById('nav').children[0].children) {
        child.style.color = "#bbefef";
        child.style.borderTop = "0px";
        child.style.borderRadius = "8px";
        child.style.marginTop = "5px";
        child.style.padding = "3px";
        child.style.backgroundColor = "#041719";
        child.style.font = "Lato";
        child.style.fontFamily = "sans-serif";
        child.style.boxShadow = '0px 0px 3px #00CCFF';
    };
    document.getElementById('nav').style.width = "8em";
    document.getElementById('nav').style.backgroundColor = "rgb(0, 0, 0, 0)";
    document.getElementById('nav').style.borderLeft = "0px";
    document.getElementById('nav').style.borderBottom = "0px";
    // chat changes
    (() => {
    var changes2 = [
        ["#chat_window", "background", "linear-gradient(145deg,rgba(1, 5, 6, 1) 0%, rgba(0, 33, 33, 1) 100%)"],
        ["#chat_window", "borderRadius", "16px"],
        ["#chat_window", "padding", "8px"],
        ["#chat_window", "boxShadow","0px 0px 5px #00CCFF"],
        ["#chat_close", "backgroundColor", "#00ddff"],
        ["#chat_close", "borderRadius", "7px"],
        ["#chat_upper", "color", "#bbefef"],
        ["#chat_lower", "color", "#bbefef"],
        ["#chat_upper", "backgroundColor", "#123f437f"],
        ["#chat_upper", "borderRadius", "12px 12px"],
        ["#chat_lower", "backgroundColor", "#123f437f"],
        ["#chat_lower", "borderRadius", "12px 12px"],
        ["#chat_tab_button", "borderRadius", "16px"],
        ["#chatbar", "backgroundColor", "#041719"],
        ["#chatbar", "color", "#bbefef"],
        ["#chatbar", "borderRadius", "7px"],
        ["#chatsend", "background", "linear-gradient(125deg,rgba(0, 180, 204, 1) 0%, rgba(0, 179, 125, 1) 100%)"],
        ["#chatsend", "color", "#ffffff"],
        ["#chatsend", "borderRadius", "16px"],
        ["#chatsend", "padding", "4px"],
        ["#chatsend", "minWidth", "4rem"],
        [".unread", "color", "#00ccff"],
        [".ui-vis", "backgroundColor", "#041719"],
        [".ui-vis", "color", "#bbefef"],
        ["#nav", "backgroundColor", "#00000000"],
        [".chatfield", "backgroundColor", "#00000000"],
        ["#chat_upper", "padding", "4px"],
        [".chatfield", "colorScheme", "dark"],
        [".chatfield", "color", "#bbefef"],
    ];

    for (let i of changes2){
        for (let e of document.querySelectorAll(i[0])){
            e.style.border = 0;
            e.style[i[1]] = i[2];
        };
    };

    // adds style to document cutely
    let head = document.getElementsByTagName('head')[0];
    let st = document.createElement('style');
    st.innerHTML = "body {background-color: #041719; color: #bbefef;} button { background: linear-gradient(125deg,rgba(0, 180, 204, 1) 0%, rgba(0, 179, 125, 1) 100%); border-radius: 16px; border: 0; color: #ffffff;} .chat_tab_button { background: linear-gradient(125deg,rgba(0, 116, 145, 1) 0%, rgba(0, 79, 51, 1) 100%); border-radius: 16px; border: 0; } .chat_tab_selected { background: linear-gradient(125deg,rgba(0, 180, 204, 1) 0%, rgba(0, 179, 125, 1) 100%); border-radius: 16px; border: 0; }";
    head.appendChild(st);
    })();
})();