// Copyright Sebastian Hothaza

// Globals
let a="";
let b="";
let op="";
let canSelectOp = false;    // Toggles when user can select an operand
let selectedOp = false;     // True once we want to start building b
let terminatedCalc = false; // True once a calc is terminated by pressing equals
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
            if (terminatedCalc) { // Reset a to fresh since coming off of terminated calc
                a=""; 
                if (decEntered) a="."; // If user has a decimal currently entered, make sure we include it!
            }
            a += mapBtn(btn); // TODO: Remove blank str and adjust mapBtn to return str
            canSelectOp = true;
            display.textContent = a; 
            terminatedCalc=false;
        } else { // Number received corresponds to b.
            b += mapBtn(btn);
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
        // Calculation is terminated however answer is carried forward to use for next calc. (Unless user presses digit)
        terminatedCalc = true;
        selectedOp = false; 
        decEntered = false;

        secondaryDisplay.textContent = a + " " + mapBtn(op) + " " + b + " " +  "="; // show calculation we just did
        a = compute(a,b,op);
        b="";
        display.textContent = a;
        
    } else if (btn === "btnClr"){
        resetCalculator();

    } else if (btn === "btnDel"){
        let curDisp = display.textContent;
        if (curDisp == a){
            if (a.length == 1){
                a = "";
                display.textContent = a;
            }else{
                if (a[a.length-1] == '.') decEntered = false; // If we deleted the decimal, allow it to be replaced!
                a = a.slice(0,a.length-1);
                display.textContent = a;
                terminatedCalc = false; // In this case, if we modified the result, we dont want to escape digits
            }
        } else if (curDisp == b) {
            if (b.length == 1){
                b = "";
                display.textContent = b;
            }else{
                if (b[b.length-1] == '.') decEntered = false; // If we deleted the decimal, allow it to be replaced!
                b = b.slice(0,b.length-1);
                display.textContent = b;
            }
        } else{ 
            resetCalculator();
        }
    } else if (btn === 'btnDec'){
        let curDisp = display.textContent;
        if (!decEntered){
            decEntered=true; //set to false when press equal or any op or reset the calc

            if (terminatedCalc) { // If terminatedCalc, the input of . is fresh and applies to building new a
                a = ".";
                display.textContent = a;
            }
            if (curDisp == a){
                a = a + ".";
                display.textContent = a;
            } else if (curDisp == b){
                b = b + ".";
                display.textContent = b;
            } 
        }
    }
}

// Given a btn in the form of btnx, returns x as string
function mapBtn(btn){
    if (btn == "btn1") return "1";
    if (btn == "btn2") return "2";
    if (btn == "btn3") return "3";
    if (btn == "btn4") return "4";
    if (btn == "btn5") return "5";
    if (btn == "btn6") return "6";
    if (btn == "btn7") return "7";
    if (btn == "btn8") return "8";
    if (btn == "btn9") return "9";
    if (btn == "btn0") return "0";

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
    if (a==".") return b;
    if (b==".") return a;


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
            return String(Math.round((a + b)*10000)/10000);
        case "btnSub":
            return String(Math.round((a - b)*10000)/10000);
        case "btnMul":
            return String(Math.round((a * b)*10000)/10000);
        case "btnDiv":
            if (b) return String(Math.round((a / b)*10000)/10000);
            alert("We don't have the technology for your request...");
            resetCalculator();
            return 0;
    }
    alert("ERROR! compute sent illegal operation!")
}

function resetCalculator(){
    a="";
    b="";
    op="";
    canSelectOp=false;
    selectedOp=false;
    decEntered=false;
    terminatedCalc = false;
    display.textContent = "";
    secondaryDisplay.textContent = "";
}
