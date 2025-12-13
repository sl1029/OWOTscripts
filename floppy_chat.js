var initialCoords = {x:(window.innerHeight*0.9),y:parseInt(elm.chat_window.style.top)}
var isDragging = false;
var skewFactorA = 1;
var skewFactorB = 1;
elm.chat_window.addEventListener("mousedown", (event) => { 
    initialCoords = {x:isNaN(parseInt(elm.chat_window.style.left))?(window.innerHeight*0.9):parseInt(elm.chat_window.style.left),y:parseInt(elm.chat_window.style.top)}
    isDragging = true;
})
elm.chat_window.addEventListener("mouseup", (event) => { 
    isDragging = false;
})
function handleSkews(initial, final) {
    
}
skewInterval = setInterval(()=>{handleSkews(initialCoords,{})},33);
