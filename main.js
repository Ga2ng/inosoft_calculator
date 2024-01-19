const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  history: [],
};


function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  // If the `displayValue` does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const currentValue = firstOperand || 0;
    const result = performCalculation[operator](currentValue, inputValue);

    calculator.displayValue = String(result);
    calculator.firstOperand = result;

    if (nextOperator === '=' ) {
      calculator.history.push(`${currentValue} ${operator} ${inputValue} = ${result}`);

      // Batasi panjang history hingga 10
      if (calculator.history.length > 10) {
        calculator.history.shift();
      }
    }
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;

  
}

function inputPercent() {
  const currentValue = parseFloat(calculator.displayValue);
  const percentValue = currentValue / 100;
  calculator.displayValue = String(percentValue);
}

function backspace() {
  calculator.displayValue = calculator.displayValue.slice(0, -1);
}

function toggleSign() {
  calculator.displayValue = String(parseFloat(calculator.displayValue) * -1);
}



const performCalculation = {
  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,

  '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

  '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

  '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}


function updateDisplay() {
  const display2 = document.querySelector('.calculator-screen-2');
  const display = document.querySelector('.calculator-screen');
  
  if (calculator.operator && !calculator.waitingForSecondOperand && calculator.operator !== '=') {
    // Menampilkan "firstOperand operator displayValue" di display2
    display2.value = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
  } else if (calculator.operator && calculator.waitingForSecondOperand && calculator.operator !== '=') {
    // Menampilkan "firstOperand operator" di display2 saat menunggu operand kedua
    display2.value = `${calculator.firstOperand} ${calculator.operator}`;
  } else {
    // Menyertakan nilai displayValue di display2
    display2.value = calculator.displayValue;
  }

  // Menyertakan nilai displayValue di display
  display.value = calculator.displayValue;

  const historyContainer = document.getElementById('history-list');
  historyContainer.innerHTML = calculator.history.map((entry) => `<li>${entry}</li>`).join('');


}


updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('all-clear')) {
    resetCalculator();
    updateDisplay();
    return;
  }

  if (target.classList.contains('percent')) {
    inputPercent();
    updateDisplay();
    return;
  }

  if (target.classList.contains('backspace')) {
    backspace();
    updateDisplay();
    return;
  }

  if (target.classList.contains('toggle-sign')) {
    toggleSign();
    updateDisplay();
    return;
  }

  inputDigit(target.value);
  updateDisplay();
});


document.addEventListener('DOMContentLoaded', function () {
  const historyContainer = document.getElementById('history');
  const closeButton = document.getElementById('close');

  // Toggling history visibility
  function toggleHistory() {
    historyContainer.classList.toggle('show-history');
  }

  // Hiding history on close button click
  closeButton.addEventListener('click', function () {
    historyContainer.classList.remove('show-history');
  });

  // Show/hide history on history button click
  document.querySelector('.calculator .p-2').addEventListener('click', toggleHistory);
  document.querySelector('#clear-history').addEventListener('click', deleteAllHistory);
});

function deleteAllHistory() {
  calculator.history = [];
  updateDisplay(); // Memastikan tampilan diupdate setelah menghapus riwayat
}