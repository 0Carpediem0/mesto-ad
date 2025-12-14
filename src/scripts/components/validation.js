const showInputError = (formElement, inputElement, errorMessage, validationSettings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(validationSettings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationSettings.errorClass);
};

const hideInputError = (formElement, inputElement, validationSettings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(validationSettings.inputErrorClass);
  errorElement.classList.remove(validationSettings.errorClass);
  errorElement.textContent = '';
};

const checkInputValidity = (formElement, inputElement, validationSettings) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement,inputElement, inputElement.validationMessage, validationSettings);
  } else {
    hideInputError(formElement, inputElement, validationSettings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
}

const disableSubmitButton = (submitButton, validationSettings) => {
  submitButton.disabled = true;
  submitButton.classList.add(validationSettings.inactiveButtonClass);
}

const enableSubmitButton = (submitButton, validationSettings) => {
  submitButton.disabled = false;
  submitButton.classList.remove(validationSettings.inactiveButtonClass);
}

const toggleButtonState = (inputList, submitButton, validationSettings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(submitButton, validationSettings);
  } else {
    enableSubmitButton(submitButton, validationSettings);
  }
}

const setEventListeners = (formElement, validationSettings) => {
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  const buttonElement = formElement.querySelector(validationSettings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, validationSettings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, validationSettings);
      toggleButtonState(inputList, buttonElement, validationSettings);
    });
  });
};

const clearValidation = (formElement, validationSettings) => {
  const inputElements = formElement.querySelectorAll(validationSettings.inputSelector);
  const submitButton = formElement.querySelector(validationSettings.submitButtonSelector);
  
  inputElements.forEach(inputElement => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (errorElement) {
      hideInputError(formElement, inputElement, validationSettings);
    }
  });
  
  if (submitButton) {
    disableSubmitButton(submitButton, validationSettings);
  }
};

const enableValidation = (validationSettings) => {
  const formList = Array.from(document.querySelectorAll(validationSettings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });
    setEventListeners(formElement, validationSettings);
  });
};

export { enableValidation, clearValidation };