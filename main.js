let inputs = [];
let results = [];

let symbols = {
  "*": "x",
  "/": "÷",
  "%": "mod",
};

const init = () => {
  //reset all styles
  resetCalc();

  //attach click event to all buttons
  initButtons();

  //inputKeyPress
  initInput();

  //attach event listener to the clear button
  let inputEl = document.querySelector("#input");
  document.querySelector("#clear").addEventListener("click", function () {
    clearInput(inputEl);
  });

  //attach listener to the = button
  document.querySelector("#calc").addEventListener("click", function () {
    calculate(inputs);
  });
};

const populateInput = (text, value, showInput = true) => {
  inputs.push(value);

  if (showInput) displayInput(text);
};

const displayInput = (text) => {
  const inputEl = document.querySelector("#input");
  inputEl.value += text.trim();
};

const clearInput = (inputEl) => {
  inputs = [];
  inputEl.value = "";
  inputEl.focus();

  document.querySelector(".inputErrors").innerText = "";
};

const buttonClicked = (e) => {
  let value = e.target.value;
  let text = e.target.textContent;

  populateInput(text, value);
};

const initInput = () => {
  const inputEl = document.querySelector("#input");

  let validKeyCodes = [
    8, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61, 96, 97, 98, 99, 100, 101,
    102, 103, 104, 105, 106, 107, 109, 110, 111, 173,
  ];

  inputEl.addEventListener("keyup", function (e) {
    // console.log(e.keyCode);

    if (!validKeyCodes.includes(e.keyCode)) {
      return;
    }

    //check if backspace is pressed
    if (e.keyCode === 8) {
      inputs.pop();
      return;
    }

    //check if the key pressed is enter
    if (e.keyCode === 13) {
      calculate(inputs);
      return;
    }

    //check if the key pressed is a operand
    if (e.key in symbols) {
      populateInput(symbols[e.key], e.key, false);
      return;
    }

    populateInput(e.key, e.key, false);
  });
};

const initButtons = () => {
  let buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.hasAttribute("data-nocompute")) {
      return;
    }
    button.addEventListener("click", buttonClicked);
  });
};

const calculate = (inputs) => {
  let formattedInput = inputs.join("");
  try {
    let result = eval(formattedInput);

    results.push(`${formattedInput} = ${result}`);

    displayResult(formattedInput, result);
  }

  catch(SyntaxError){
    document.querySelector(".inputErrors").innerText = "Malformed Syntax";
  }
  
};

const displayResult = (formattedInput, result) => {
  setInput(result);
  appendResult(results);
};

const setInput = (result) => {
  const inputEl = document.querySelector("#input");
  inputs = [];

  inputs.push(result);
  inputEl.value = result;
};

const setInputValue = (index, result) => {
  const inputEl = document.querySelector("#input");
  inputs = [];
  let splittedResult = result.split("");
  splittedResult.forEach((res) => inputs.push(res));
  inputEl.value = result;
};

const appendResult = (results) => {
  const resultsDiv = document.querySelector(".results");

  resultsDiv.innerHTML = "";
  const resultsCount = results.length;

  for (let i = resultsCount; i > 0; i--) {
    let index = i - 1;
    let formattedResult = results[index].split("=");

    const resultDiv = document.createElement("div");
    resultDiv.setAttribute("index", index);
    resultDiv.classList.add("result");

    const operationDiv = document.createElement("div");
    operationDiv.setAttribute("index", index);

    let span = document.createElement("span");
    span.innerText = formattedResult[0];

    operationDiv.classList.add("operation");
    operationDiv.appendChild(span);

    const outputDiv = document.createElement("div");
    outputDiv.classList.add("output");
    outputDiv.setAttribute("index", index);

    let span1 = document.createElement("span");
    let span2 = document.createElement("span");

    span1.innerText = "=";
    outputDiv.appendChild(span1);

    span2.innerText = formattedResult[1];
    outputDiv.appendChild(span2);

    resultDiv.appendChild(operationDiv);
    resultDiv.appendChild(outputDiv);

    resultsDiv.appendChild(resultDiv);

    resultDiv.addEventListener("click", retrieveResult);
  }
};

const retrieveResult = (e) => {
  let index = e.target.getAttribute("index");
  let result = results[index].split("=");

  setInputValue(index, result[0].trim());
};

const resetCalc = () => {
  const results = document.querySelector(".results");
  results.innerHTML = "";

  const input = document.querySelector("#input");
  clearInput(input);
};

document.addEventListener("DOMContentLoaded", init);
