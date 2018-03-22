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
function validateInput(inp, error) {
    if (!error) {
        inp.classList.remove(invalidClassName);
        inp.classList.add(validClassName);
    } else {
        inp.classList.add(invalidClassName);
        inp.classList.remove(validClassName);
    }
    document.querySelector(`#${inp.id} ~ .invalid-feedback`).innerHTML = error;
    validityMap[inp.id] = error;
}

function validatePassword() {
    const input = document.getElementById(PAS_INPUT);
    let error;
    if (!input.value)
        error = "You must repeat your password";
    else if (!pasReg.test(input.value))
        error = "Password must have at least one digit and 8 sings";
    validateInput(input, error);
    return error;
}

function validateRepeatedPassword() {
    const input = document.getElementById(PAS_REP_INPUT);
    let error;
    if (!input.value)
        error = "Password is required";
    else if (!pasReg.test(input.value))
        error = "Password must have at least one digit and 8 sings";
    else if (input.value !== document.getElementById(PAS_INPUT).value)
        error = "Repeated and original password are not equal";
    validateInput(input, error);
    return error;
}

function validateInputNotEmpty(id, inpName) {
    const input = document.getElementById(id);
    let error;
    if (!input.value) {
        error = `${inpName} is required`
    }
    validateInput(input, error);
    return error;
}

function validateLastName() {
    return validateInputNotEmpty(LN_INPUT, "Last name");
}

function validateFirstName() {
    return validateInputNotEmpty(FN_INPUT, "First name");
}

function validateEmail() {
    const emailInput = document.getElementById(EMAIL_INPUT);
    let error;
    if (!emailInput.value)
        error = "Email is required";
    else if (!emailReg.test(emailInput.value))
        error = "Email is not valid";

    validateInput(emailInput, error);
    return error;
}

function validateDateOfBirth() {
    const dateOfBirth = document.getElementById(DATE_OF_BIRTH_INPUT);
    const valueAsDate = dateOfBirth.valueAsDate;
    let error;
    if (valueAsDate == null)
        error = "Date of birth is required";
    else if (new Date() - valueAsDate < 0)
        error = "Date of birth is invalid";
    validateInput(dateOfBirth, error);
    return error;
}

function onSubmit(event) {
    let forms = document.querySelector('.needs-validation');
    const errors = validityFuncs.map(f => f()).filter(r => r);
    event.preventDefault();
    event.stopPropagation();
    forms.classList.add('was-validated');
}
