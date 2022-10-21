// Copyright Sebastian Hothaza

// NOTE: Display holds up to 10 digits

// TODO: Add keyboard support


// Globals
let a="";
let b="";
let op="";
let canSelectOp = false; // Toggles when user can select an operand
let selectedOp = false; // True once we want to start building b
let escaped = false; // Used to define fresh a when digit selected after using equals
let display = document.querySelector('.display');



// Adding a click listener for all buttons
const allBtns = document.querySelectorAll('button');
allBtns.forEach((btn) => {
    btn.addEventListener('click', e => {
        handleInput(e.target.id);
    });
});




// a op b format used!
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
        op = btn;
        selectedOp = true;
        display.textContent = mapBtn(op);

        // rolling calculation
        if (b){ 
            a = compute(a,b,op); // Compute new a value, b is still to be input
            b = "";
        } 



    } else if (btn === "btnEqu" && b){
        a = compute(a,b,op);
        b="";
        display.textContent = a;
        selectedOp = false; // Roll forward as a new op
        escaped = true;


        
    } else if (btn === "btnClr"){
        resetCalculator();
    } else if (btn === "btnDel"){
        let curDisp = display.textContent;
        console.log("Currently on display: "+curDisp);
        if (curDisp == a){
            if (a<10){
                a = "";
                display.textContent = 0;
            }else{
                a = a.slice(0,a.length-1);
                display.textContent = a;
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
            if (curDisp<10){ //not working properly
                console.log("CalcReset");
                resetCalculator();
            } else {
                a = curDisp.slice(0,curDisp.length-1);
                display.textContent = a; 
                b="";
            }     
        }
    } else if (btn === 'btnDec'){
        //TODO
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
function compute(a, b, op){
    // We assure conversion to int for now
    if (a == ""){
        a = 0;
    }else{
        a = parseInt(a);
    }
    if (b == ""){
        b = 0;
    }else{
        b = parseInt(b);
    }
    switch(op){
        case "btnAdd":
            return String(a + b);
        case "btnSub":
            return String(a - b);
        case "btnMul":
            return String(a * b);
        case "btnDiv":
            if (b) return String(a / b);
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
    display.textContent = "0";
}