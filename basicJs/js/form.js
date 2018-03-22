const emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const pasReg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
const invalidClassName = "is-invalid";
const validClassName = "is-valid";
const DATE_OF_BIRTH_INPUT = "date-of-birth";
const EMAIL_INPUT = "email";
const PAS_INPUT = "password";
const PAS_REP_INPUT = "password-repeated";
const FN_INPUT = "first-name";
const LN_INPUT = "last-name";
const validityFuncs = [validateFirstName, validateLastName, validateEmail, validatePassword, validateRepeatedPassword, validateDateOfBirth];
const validityMap = {};
const errorsDiv = document.getElementById("errors");
let showErrors;

function updateErrors() {
    if (showErrors) {
        const errorStr = Object.keys(validityMap)
            .map(k => {
                const key = k.replace(/-/g, " ").replace(/(^| )(\w)/g, s => s.toUpperCase())
                const value = validityMap[k];
                if (value) {
                    return `${key}: ${value}`
                }
            })
            .filter(x => x)
            .reduce((add, acc) => `${acc}\n${add}`);
        if (errorStr.trim().length === 0) {
            errorsDiv.style.display = "none";
            showErrors = false;
        } else {
            errorsDiv.style.display = "block";
            errorsDiv.innerText = errorStr;
        }
    } else {
        errorsDiv.style.display = "none"
    }
}

function validateInput(inp, error, skipErrorsListUpdate) {
    if (error) {
        inp.classList.remove(validClassName);
        inp.classList.add(invalidClassName);
    } else {
        inp.classList.remove(invalidClassName);
        inp.classList.add(validClassName);
    }
    if (!skipErrorsListUpdate) {
        updateErrors()
    }
    document.querySelector(`#${inp.id} ~ .invalid-feedback`).innerHTML = error;
    updateErrors();
    validityMap[inp.id] = error;
}

function validatePassword(skipErrorsListUpdate) {
    const input = document.getElementById(PAS_INPUT);
    let error;
    if (!input.value)
        error = "You must repeat your password";
    else if (!pasReg.test(input.value))
        error = "Password must have at least one digit and 8 sings";
    validateInput(input, error, skipErrorsListUpdate);
    return error;
}

function validateRepeatedPassword(skipErrorsListUpdate) {
    const input = document.getElementById(PAS_REP_INPUT);
    let error;
    if (!input.value)
        error = "Password is required";
    else if (!pasReg.test(input.value))
        error = "Password must have at least one digit and 8 sings";
    else if (input.value !== document.getElementById(PAS_INPUT).value)
        error = "Repeated and original password are not equal";
    validateInput(input, error, skipErrorsListUpdate);
    return error;
}

function validateInputNotEmpty(id, inpName, skipErrorsListUpdate) {
    const input = document.getElementById(id);
    let error;
    if (!input.value) {
        error = `${inpName} is required`
    }
    validateInput(input, error, skipErrorsListUpdate);
    return error;
}

function validateLastName(skipErrorsListUpdate) {
    return validateInputNotEmpty(LN_INPUT, "Last name", skipErrorsListUpdate);
}

function validateFirstName(skipErrorsListUpdate) {
    return validateInputNotEmpty(FN_INPUT, "First name", skipErrorsListUpdate);
}

function validateEmail(skipErrorsListUpdate) {
    const emailInput = document.getElementById(EMAIL_INPUT);
    let error;
    if (!emailInput.value)
        error = "Email is required";
    else if (!emailReg.test(emailInput.value))
        error = "Email is not valid";

    validateInput(emailInput, error, skipErrorsListUpdate);
    return error;
}

function validateDateOfBirth(skipErrorsListUpdate) {
    const dateOfBirth = document.getElementById(DATE_OF_BIRTH_INPUT);
    const valueAsDate = dateOfBirth.valueAsDate;
    let error;
    if (valueAsDate == null)
        error = "Date of birth is required";
    else if (new Date() - valueAsDate < 0)
        error = "Date of birth is invalid";
    validateInput(dateOfBirth, error, skipErrorsListUpdate);
    return error;
}

function onSubmit(event) {
    let forms = document.querySelector('.needs-validation');
    const errors = validityFuncs.map(f => f(true)).filter(r => r);
    showErrors = errors.length > 0;
    updateErrors();
    event.preventDefault();
    event.stopPropagation();
    forms.classList.add('was-validated');
}
