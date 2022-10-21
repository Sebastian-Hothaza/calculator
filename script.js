// Copyright Sebastian Hothaza

// TODO: Add decimal support
// TODO: Fix issue with del and decimals



// Globals
let a="";
let b="";
let op="";
let canSelectOp = false;    // Toggles when user can select an operand
let selectedOp = false;     // True once we want to start building b
let escaped = false;        // Used to define fresh a when digit selected after using equals
let decEntered=false;
let display = document.querySelector('.display');
let secondaryDisplay = document.querySelector('.secondaryDisplay');



// Adding a click listener for all buttons
const allBtns = document.querySelectorAll('button');
allBtns.forEach((btn) => {
    btn.addEventListener('click', e => {
        handleInput(e.target.id);
    });
});

// Keyboard handling
window.addEventListener('keydown', e => {
    switch (e.code){
        case 'Digit1': if (!e.shiftKey) handleInput('btn1'); break;
        case 'Digit2': if (!e.shiftKey) handleInput('btn2'); break;
        case 'Digit3': if (!e.shiftKey) handleInput('btn3'); break;
        case 'Digit4': if (!e.shiftKey) handleInput('btn4'); break;
        case 'Digit5': if (!e.shiftKey) handleInput('btn5'); break;
        case 'Digit6': if (!e.shiftKey) handleInput('btn6'); break;
        case 'Digit7': if (!e.shiftKey) handleInput('btn7'); break;
        case 'Digit8': 
            if (!e.shiftKey){
                handleInput('btn8');
            } else {
                handleInput('btnMul');
            }
            break;
        case 'Digit9': if (!e.shiftKey) handleInput('btn9'); break;
        case 'Digit0': if (!e.shiftKey) handleInput('btn0'); break;

        case 'Equal':
            if (e.shiftKey){
                handleInput('btnAdd');
            }else{
                handleInput('btnEqu');
            }
            break;
        case 'Enter':
            handleInput('btnEqu'); break;
        case 'Minus': if (!e.shiftKey) handleInput('btnSub'); break;
        case 'Slash': if (!e.shiftKey) handleInput('btnDiv'); break;

        case 'Period': if (!e.shiftKey) handleInput('btnDec'); break;

        case 'Backspace': handleInput('btnDel'); break;
        case 'Escape': handleInput('btnClr'); break;
    }
});


// a op b format
function handleInput(btn){
    if (btn === "btn1" || btn === "btn2" || btn === "btn3" || btn === "btn4" || btn === "btn5" ||
        btn === "btn6" || btn === "btn7" || btn === "btn8" || btn === "btn9" || btn === "btn0"){
        // Numeric input, can be clicked at any point

        // If number corresponds to a
        if (!selectedOp){ 
            if (escaped) a=""; // Reset a to fresh since coming off of equals
            a = ("" + a + mapBtn(btn));
            canSelectOp = true;
            display.textContent = a; 
            escaped=false;
        } else { // Number received corresponds to b.
            b = ("" + b + mapBtn(btn));
            display.textContent = b;
        }



    } else if (canSelectOp && (btn === "btnAdd" || btn === "btnSub" || btn === "btnMul" || btn === "btnDiv")){
        
        // rolling calculation
        if (b){ 
            a = compute(a,b,op); // Compute new a value, b is still to be input. Use old op
            b = "";
        } 
        // Update op and display it
        op = btn;
        display.textContent = "";
        secondaryDisplay.textContent = a + " " + mapBtn(op);
        selectedOp = true;
        decEntered = false;



    } else if (btn === "btnEqu" && b){
        secondaryDisplay.textContent = a + " " + mapBtn(op) + " " + b + " " +  "=";
        a = compute(a,b,op);
        b="";
        display.textContent = a;
        selectedOp = false; // Roll forward as a new op
        escaped = true;
        decEntered = false;


        
    } else if (btn === "btnClr"){
        resetCalculator();

    } else if (btn === "btnDel"){
        let curDisp = display.textContent;
        if (curDisp == a){
            if (a<10){
                a = "";
                display.textContent = 0;
            }else{
                a = a.slice(0,a.length-1);
                display.textContent = a;
                escaped = false; // In this case, if we modified the result, we dont want to escape digits
            }
        } else if (curDisp == b) {
            if (b<10){
                b = "";
                display.textContent = 0;
            }else{
                b = b.slice(0,b.length-1);
                display.textContent = b;
            }
        } else{ 
            resetCalculator();
        }
    } else if (btn === 'btnDec'){
        let curDisp = display.textContent;
        if (!decEntered){
            decEntered=true; //need to set to false when press equal or any op

            if (curDisp == a){
                a = a + ".";
                display.textContent = a;
            } else if (curDisp == b){
                b = b + ".";
                display.textContent = b;
            } else {
                // TODO
            }
        }
    }
}

// Given a btn in the form of btnx, returns x
function mapBtn(btn){
    if (btn == "btn1") return 1;
    if (btn == "btn2") return 2;
    if (btn == "btn3") return 3;
    if (btn == "btn4") return 4;
    if (btn == "btn5") return 5;
    if (btn == "btn6") return 6;
    if (btn == "btn7") return 7;
    if (btn == "btn8") return 8;
    if (btn == "btn9") return 9;
    if (btn == "btn0") return 0;

    if (btn == "btnAdd") return '+';
    if (btn == "btnSub") return '-';
    if (btn == "btnMul") return '*';
    if (btn == "btnDiv") return '÷';

    if (btn == "btnDec") return '.';

    if (btn == "btnEqu") return '=';
}


// Returns a op b where op is the id of the opBtn AS STRING!
// Rounds result to 4 decimal places
function compute(a, b, op){
    // We assure conversion to int for now
    if (a == ""){
        a = 0;
    }else{
        a = parseFloat(a);
    }
    if (b == ""){
        b = 0;
    }else{
        b = parseFloat(b);
    }
    switch(op){
        case "btnAdd":
            return String(a + b);
        case "btnSub":
            return String(a - b);
        case "btnMul":
            return String(Math.round((a * b)*10000)/10000);
        case "btnDiv":
            if (b) return String(Math.round((a / b)*10000)/10000);
            alert("We don't have the technology for your request...");
            resetCalculator();
            return 0;
    }
}

function resetCalculator(){
    a="";
    b="";
    op="";
    canSelectOp=false;
    selectedOp=false;
    decEntered=false;
    display.textContent = "";
    secondaryDisplay.textContent = "";
}