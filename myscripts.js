let displayContent = "";
const keys = ['+', '-', '*', '/', 'Backspace', 'Enter', 'Delete', 'Escape', '.', '='];

function add(x, y) {
    return parseFloat(x) + parseFloat(y);
}

function subtract(x, y) {
    return parseFloat(x) - parseFloat(y);
}

function divide(x, y) {
    return parseFloat(x) / parseFloat(y);
}

function multiply(x, y) {
    return parseFloat(x) * parseFloat(y);
}


function operate() {
    let operators = ['+', '-', '*', '/'];
    let solution = 0;
    let operatorIndex = -1;
    let operator = "";
    let x = "";
    let y = "";
    while (true) {

        //searches for index of first operator
        for (let i = 0; i < displayContent.length; i++) {
            if (operators.includes(displayContent[i])) {
                operatorIndex = i;
                break;
            } else {
                operatorIndex = -1;
            }
        }

        // if there is no operator to be found there is no math to be done
        if (operatorIndex === -1) {

            //if there is no solution, it re-displays whatever is on the screen, in the case it was a singular number, !y accounts for 0/some number
            if (!solution && !y) {
                solution = displayContent;
            }
            return solution;
        }

        //gather operator 
        operator = displayContent[operatorIndex];

        //if the operator is at index 0, it means it is the second operation in the problem, in which case the previous solution must stored as x
        if (operatorIndex === 0) {
            x = solution;
        } else {

            //if the operator isnt at zero this is the first operation in the problem, number preceeding the operator must be stored as x
            x = displayContent.slice(0,operatorIndex);
        }

        //removes the gathered data from the display content, it is already stored
        displayContent = displayContent.substring(operatorIndex+1);

        //gets index of next operator if there is one
        for (let i = 0; i < displayContent.length; i++) {
            if (operators.includes(displayContent[i])) {
                operatorIndex = i;
                break;
            } else {
                operatorIndex = -1;
            }
        }

        //if there is no other operator then all space left must be occupied by the number that will comprise 'y'
        if (operatorIndex === -1) {
            y = displayContent.slice(0);
        } else {
            y = displayContent.slice(0,operatorIndex);
        }

        console.log(`${x} ${operator} ${y}`);

        //chop off the number that comprised y
        displayContent = displayContent.substring(operatorIndex);
        if(operator === '+') {
            solution = add(x, y);
        } 
        else if (operator === '-') {
            solution = subtract(x, y);
        }
        else if (operator === '*') {
            solution = multiply(x, y);
        }
        else if (operator === '/') {
            solution = divide(x, y);
        }
    }
}

//function that makes sure buttons aren't clicked that will cause errors or the program to break

function disableButtons(e) {
    const operationSigns = ['-', '+', '*', '/'];
    const disable = document.querySelectorAll('.disable');
    const operation = document.querySelectorAll('.operation');
    const decimal = document.querySelector('.decimal');
    let input = "";
    if (e.type === 'keydown') {
        if (e.key === 'Delete' || e.key === 'Escape') {
            input = 'Clear';
        }
        else if (e.key === 'Enter') {
            input = '=';
        } else {
            input = e.key.toString();
        }
    } else {
        input = e.target.textContent;
    }
    if (input === '0' && displayContent.slice(-1) === '/') {
        alert("DO YOU HAVE ANY IDEA WHAT YOU WERE ABOUT TO DO??!?!? WE'RE CLEARING THIS WHOLE CALCULATION AND I'M KEEPING MY EYE ON YOU!");
        displayContent = "";
        return;
    }
    if (input === "=") {
        if (!displayContent) {
            alert("You've got nothing to calculate!");
            displayContent = "";
            return;
        } else {
            operation.forEach((button) => {
                button.disabled = false;
            });
            return;
        }
    }
    if (input === '.') {
        decimal.disabled = true;
    }
    if (operationSigns.includes(input)) {
        disable.forEach((button) => {
            button.disabled = true;
        });
        decimal.disabled = false;
    } else {
        disable.forEach((button) => {
            button.disabled = false;
        });
    }
}

//creates a list of all the buttons and attaches event listeners to disable buttons, change the display, and calculate the equation

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    button.addEventListener('click', disableButtons);
    button.addEventListener('click', updateDisplay);
});

//event listener for keys being pressed
document.addEventListener('keydown', keyPress);

function keyPress(e) {
    event.preventDefault();
    if (keys.includes(e.key) || (e.key >= 0 && e.key <= 9)) {
        disableButtons(e);
        updateDisplay(e);
    }
}

//function to be called whenever a button that changes the display is called

function updateDisplay(e) {
    let input = ""
    if (e.type === 'keydown') {
        if (e.key === 'Delete' || e.key === 'Escape') {
            input = 'Clear';
        }
        else if (e.key === 'Enter') {
            input = '=';
        } else {
            input = e.key.toString();
        }
    } else {
        input = e.target.textContent;
    }
    const display = document.getElementById('display');
    const displayText = document.getElementById('displayText');
    if (input === 'Backspace') {
        if (!displayContent) {
            return;
        } else {
            //enables decimal if a decimal was the char that was backspaced
            if (displayContent.toString().slice(-1) === '.') {
                document.querySelector('.decimal').disabled = false;
            }

            //backspaces over the last char
            displayContent = displayContent.toString().slice(0,-1);
            displayText.textContent = `${displayContent}`;
            return;
        }
    }
    if (input === '=') {
        if (displayContent === "") {
            return;
        }
        let solution = operate();

        //checks to see if solution is decimal, if so returns only 2 decimal places
        if (solution % Math.floor(solution) != 0) {
            solution = solution.toFixed(3);
        }
        displayContent = solution;
        document.getElementById('displayText').textContent = solution;
        return;
    } 
    if (input === 'Clear') {

        //enables decimal again when clear is called
        document.querySelector('.decimal').disabled = false;

        //resets display content
        displayContent = "";
        if (displayText) {

            //clears textnode and deletes it
            document.getElementById('displayText').textContent = "";
            display.removeChild(display.firstChild);
        }
        return;
    }

    //concatenates whatever was clicked to existing display content
    if (!(input === '0' && !displayContent)) {
        displayContent += input;
    }
    if (!displayText) {

        //if no existing display content, creates new node and updates text content to whatever was clicked
        let newDisplayText = document.createElement('p');
        newDisplayText.setAttribute('id', 'displayText');
        newDisplayText.textContent = `${displayContent}`
        display.appendChild(newDisplayText);
    } else {

        //if existing text, updates node with new content
        displayText.textContent = ` ${displayContent}`;
    }
}