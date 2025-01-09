const LIMIT = 10000;
let currentLimit = LIMIT;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';

const inputNode = document.querySelector('.js-expenses-amount-input');
const buttonNode = document.querySelector('.js-expenses-amount-btn');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');
const currentCategoryNode = document.querySelector('.js-category');
const clearButtonNode = document.querySelector('.js-clear-button');
const limitChangeNode = document.querySelector('.js-limit-image');
const popupNode = document.querySelector('.js-popup');
const popupFormNode = document.querySelector('.js-popup-form');
const popupInputNode = document.querySelector('.js-popup-input');
const popupSubmitNode = document.querySelector('.js-popup-submit');
const popupCloseNode = document.querySelector('.js-popup-close');

const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if (Array.isArray(expensesFromStorage)) {
  expenses = expensesFromStorage;
}
render();

init();

buttonNode.addEventListener('click', function() {
    const expense = getExpenseFromUser();

    if (!expense) {
        if (currentCategoryNode.value === 'Категория') {
            alert('Выберите категорию');
          }
      
        return;
    }

    trackExpense(expense);
    saveExpensesToLocalStorage();
    render(expenses);
});

clearButtonNode.addEventListener('click', function () {
    expenses = [];
    saveExpensesToLocalStorage();
    render();
});

limitChangeNode.addEventListener('click', openPopup);
popupFormNode.addEventListener('submit', changeLimit);
popupCloseNode.addEventListener('click', closePopup);

function init() {
    loadExpensesFromLocalStorage();
    currentLimit = loadLimitFromLocalStorage(); // Загрузка сохраненного значения лимита из локального хранилища
    limitNode.innerText = currentLimit; // Используем текущий лимит для отображения
    statusNode.innerText = STATUS_IN_LIMIT;
    render();
};

function saveExpensesToLocalStorage() {
  const expensesString = JSON.stringify(expenses);
  localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

function trackExpense(expense) {
    expenses.push({ category: currentCategoryNode.value, amount: expense });
    saveExpensesToLocalStorage();
}



function getExpenseFromUser() {
    if (!inputNode.value || currentCategoryNode.value === 'Категория') {
      return null;
    }

    const expense = parseInt(inputNode.value);
    if (isNaN(expense)) {
      alert("Введите корректную сумму!");
      return null;
  }

  if (expense <= 0) {
    alert("Введите положительное значение для расхода");
    return null;
}

    clearInput();  
    return expense;
  }

  function clearInput() {
    inputNode.value = '';
  }

  function calculateExpenses() {
    let sum = 0;
  
    expenses.forEach((element) => {
      sum += element.amount;
    });
  
    return sum;
  }

  function render() {
    const sum = calculateExpenses();
  
    renderHistory();
    renderSum(sum);
    renderStatus(sum);
  }

  function renderHistory() {
    let expensesListHTML = '';
  
    expenses.forEach((element) => {
      expensesListHTML += `<li>${element.category}: ${element.amount} ${CURRENCY}</li>`;
    });
  
    historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
  }

  function renderSum(sum) {
    sumNode.innerText = sum;
  }

  function renderStatus(totalSum) {
    statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  
    if (totalSum <= currentLimit) { // Используем текущий лимит для проверки
      statusNode.innerText = STATUS_IN_LIMIT;
    } else {
      statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${currentLimit - totalSum} ${CURRENCY})`; // Используем текущий лимит для отображения
      statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
    }
  }
  
  function openPopup() {
    popupNode.style.display = 'block';
    popupInputNode.value = currentLimit; // Используем текущий лимит для отображения
  }
  
  function closePopup() {
    popupNode.style.display = 'none';
  }
  
  function changeLimit(event) {
    event.preventDefault();
    const newLimit = parseInt(popupInputNode.value);
    if (!isNaN(newLimit)) {
      currentLimit = newLimit; // Обновляем текущий лимит
      saveLimitToLocalStorage(currentLimit); // Сохраняем новое значение лимита в локальное хранилище
      limitNode.innerText = currentLimit; // Используем текущий лимит для отображения
      render();
      closePopup();
    }
  }
  
  function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }
  
  function loadExpensesFromLocalStorage() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      expenses = JSON.parse(storedExpenses);
    }
  }
  
  function saveLimitToLocalStorage(limit) {
    localStorage.setItem(STORAGE_LABEL_LIMIT, limit.toString());
  }
  
const newLocal = 'limit';
  function loadLimitFromLocalStorage() {
    const storedLimit = localStorage.getItem(STORAGE_LABEL_LIMIT);
    if (storedLimit) {
      return parseInt(storedLimit);
    }
    return LIMIT;
    }