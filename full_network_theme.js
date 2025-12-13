    // font imports
    menu.addOption("Redraw canvas",()=>{w.redraw(); let redrawCanvasOption = 1;});
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css?family=JetBrains Mono:400,500,700');
    document.head.appendChild(link);
    var link2 = document.createElement('link');
    link2.setAttribute('rel', 'stylesheet');
    link2.setAttribute('type', 'text/css');
    link2.setAttribute('href', 'https://fonts.googleapis.com/css?family=Lato:400');
    document.head.appendChild(link2);
    // canvas changes
    var changes = {owner: "#08282f", member: "#041719", public: "#010506", text: "#bbefef", cursor: "#7befef88"};
    var defaults = defaultStyles();
    if (typeof myhub_mode == undefined) var myhub_mode = 1;
    // have to do it async otherwise it wouldn't work
    for (const [key, value] of Object.entries(changes)) {
        styles[key] = value;
        w.changeFont("$px JetBrains Mono");
        w.changeFont("$px JetBrains Mono:500");
    };
    w.redraw();
    // font changes
    for (let i = 0; i < 3; i++) {
        w.changeFont("$px JetBrains Mono");
        w.changeFont("$px JetBrains Mono:500");
    };
    let collection = document.getElementsByTagName("div");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.fontFamily = 'Lato';
        collection[i].style.fontFamily = 'Lato:400';
    };
    // modal style changes
    collection = document.getElementsByClassName("modal_frame");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.backgroundColor = '#041719';
        collection[i].style.borderRadius = '12px';
        collection[i].style.boxShadow = '0px 0px 5px #00CCFF';
        collection[i].style.color = "#bbefef";
    };
    collection = document.getElementsByClassName("modal_client");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.backgroundColor = '#113f43';
        collection[i].style.borderRadius = '6px';
        collection[i].style.color = "#bbefef";
    };
    Modal.prototype.focusTab = function(id) {
	    if(this.currentTabCtx == this.tabIndex[id]) {
	    	return;
	    }

	    if(this.tabChangeFn) {
	    	this.tabChangeFn({
	    		id: id
	    	});
	    }

	    var prev = this.currentTabCtx;
	    var curr = this.tabIndex[id];
	    this.currentTabCtx = this.tabIndex[id];

	    prev.client.style.display = "none";
	    prev.tabButton.style.height = "18px";
        prev.tabButton.style.borderRadius = "8px 8px 0 0";
        prev.tabButton.style.padding = "0 8px 0";
	    prev.tabButton.style.backgroundColor = "#041719";

	    curr.client.style.display = "";
	    curr.tabButton.style.height = "20px";
        curr.tabButton.style.borderRadius = "8px 8px 0 0";
        curr.tabButton.style.padding = "0 8px 0";
	    curr.tabButton.style.backgroundColor = "#113f43";

	    // transfer context
	    this.client = curr.client;
	    this.inputField = curr.inputField;
	    this.formTitle = curr.formTitle;
	    this.formField = curr.formField;
        this.formInputs = curr.formInputs;
        this.hasSubmitted = false;
        this.cbField = curr.cbField;
        this.cbList = curr.cbList;
        this.cbCallback = curr.cbCallback;
    }
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
        ["#confirm_js", "background", "linear-gradient(145deg,rgba(1, 5, 6, 1) 0%, rgba(0, 33, 33, 1) 100%)"],
        ["#confirm_js", "borderRadius", "16px"],
        ["#confirm_js", "padding", "8px"],
        ["#confirm_js", "boxShadow","0px 0px 5px #00CCFF"],
        ["#confirm_js_code", "background", "#000000"],
        ["#confirm_js_code", "font", "JetBrains Mono"],
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

    // because .chat_tab_selected has to be done differently :ohno:
    let head = document.getElementsByTagName('head')[0];
    let st = document.createElement('style');
    st.innerHTML = "body {background-color: #041719; color: #bbefef;} button { background: linear-gradient(125deg,rgba(0, 180, 204, 1) 0%, rgba(0, 179, 125, 1) 100%); border-radius: 16px; border: 0; color: #ffffff;} .chat_tab_button { background: linear-gradient(125deg,rgba(0, 116, 145, 1) 0%, rgba(0, 79, 51, 1) 100%); border-radius: 16px; border: 0; } .chat_tab_selected { background: linear-gradient(125deg,rgba(0, 180, 204, 1) 0%, rgba(0, 179, 125, 1) 100%); border-radius: 16px; border: 0; }";
    head.appendChild(st);
    })();