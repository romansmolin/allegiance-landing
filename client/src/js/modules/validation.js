const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    onlyCountries: ["us", "ca", "lv"],
    utilsScript: "src/js/intlTelInput/utils.js",
});

function handleChoiceButtonClick(button, updateFunction, errorId, dynamicSpan) {
    const errorSpan = document.getElementById(errorId);
    const dynamicFields = document.querySelectorAll(dynamicSpan);

    if (errorSpan.textContent) {
        errorSpan.textContent = "";
    }

    const container = button.closest('.input-wrapper'); // Find the closest container
    const buttonsInContainer = container.querySelectorAll('.button'); // Select buttons only within this container

    buttonsInContainer.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    const data = button.getAttribute("data-type");

    dynamicFields.forEach(field => {
        field.textContent = data;
    })

    updateFunction(data);
}

function validateInput(input, errorId, updateFunction, validationRegex, errorMessage) {
    const errorSpan = document.getElementById(errorId);
    const condition = !validationRegex.test(input.value);

    checkIfValid(condition, input, input.value, errorSpan, errorMessage, updateFunction)
}

function checkIfValid(condition, input, inputValue, errorSpan, errorMessage, updateFunction) {

    if (condition) {
        errorSpan.textContent = errorMessage;
        input.classList.add("wrong")
        updateFunction(input.id, "");
        setValidationIcon(input.id, false)

    } else {
        input.classList.remove("wrong")
        errorSpan.textContent = "";
        updateFunction(input.id, inputValue);
        setValidationIcon(input.id, true)
    }

    if (!inputValue) {
        errorSpan.textContent = "";
        input.classList.remove("wrong");
    }
}

function validateZipCode(input, errorId, updateFunction) {
    const errorMessage = "Please enter a valid US or CA zip code";

    const zipCode = input.value;
    const errorSpan = document.getElementById(errorId);

    const usZipCodePattern = /^\d{5}(?:-\d{4})?$/;
    const caPostalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

    const isUSZipCode = usZipCodePattern.test(zipCode);
    const isCAPostalCode = caPostalCodePattern.test(zipCode);

    const condition = !(isUSZipCode || isCAPostalCode);

    if (input.value) {
        setCountry(isUSZipCode, isCAPostalCode, zipCode, input.id);
        checkIfValid(condition, input, input.value, errorSpan, errorMessage, updateFunction);
    }

}

function validateFullName(input, errorId, updateFuntion) {
    const validationRegex = /^[A-Za-z\s'-]+$/;
    const errorMessage = "Please enter a valid name";

    if (input.value) {
        validateInput(input, errorId, updateFuntion, validationRegex, errorMessage);
    }
}

function validateEmail(input, errorId, updateFunction) {
    const validationRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const errorMessage = "Please enter a valid email";

    if (input.value) {
        validateInput(input, errorId, updateFunction, validationRegex, errorMessage);
    }
}

function validatePhone(errorId, updateFunction) {
    const phoneNumber = phoneInput.getNumber();
    const isValid = phoneInput.isValidNumber();

    const errorMessage = "Please enter a valid phone number.";
    const errorSpan = document.getElementById(errorId);

    const inputField = document.getElementById('phone')

    const condition = !isValid;

    if (phoneNumber) {
        checkIfValid(condition, inputField, phoneNumber, errorSpan, errorMessage, updateFunction)
    }
}

async function validateFirstStep() {
    const errors = [];

    const filedsToValidate = [
        {
            name: 'ozip',
            errorSpan: document.getElementById('ozip-error'),
            errorMessage: 'Please enter Moving From Zip Code.'
        },
        {
            name: 'dzip',
            errorSpan: document.getElementById('dzip-error'),
            errorMessage: 'Please enter Moving To Zip Code.'
        },
    ]

    if (!formData.dzip || !formData.ozip) {
        validateFieldsOnChangingStep(filedsToValidate)
    } else {
        const dzipApiCall = formData.dzipCountry === "CA" ? formData.dzip.replace(' ', '%20') : formData.dzip;
        const ozipApiCall = formData.ozipCountry === "CA" ? formData.ozip.replace(' ', '%20') : formData.ozip;

        try {
            const [dzipResponse, ozipResponse] = await Promise.all([
                getCityAndState(dzipApiCall, formData.dzipCountry),
                getCityAndState(ozipApiCall, formData.ozipCountry)
            ]);

            if (dzipResponse.status === "ZERO_RESULTS") {
                filedsToValidate[0].errorSpan.textContent = 'Please enter existing zip code';
                errors.push('Moving From Error')
                setValidationIcon('ozip', false)
            } 

            if (ozipResponse.status === "ZERO_RESULTS") {
                filedsToValidate[1].errorSpan.textContent = 'Please enter existing zip code';
                errors.push('Moving To Error')
                setValidationIcon('dzip', false)
            } 

            if (errors.length > 0) {
                return
            }

            navigateStep(2, 1);
            gtag('event', `first-step-completed`, {
                'event_label': `first-step-completed`,
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

function validateSecondStep() {
    if (!formData.movesize || !formData.movedte ||!formData.propertyType) {
        const filedsToValidate = [
            {
                name: 'movedte',
                errorSpan: document.getElementById('date-error'),
                errorMessage: 'You Need To Choose One Option.'
            },
            {
                name: 'movesize',
                errorSpan: document.getElementById('size-error'),
                errorMessage: 'You Need To Choose One Option.'
            },
            {
                name: 'propertyType',
                errorSpan: document.getElementById('property-error'),
                errorMessage: 'You Need To Choose One Option.'
            },
        ]

        for (const { name, errorSpan, errorMessage } of filedsToValidate) {
            if (!formData[name]) {
                errorSpan.textContent = errorMessage;
                setValidationIcon(name, false)
            } else {
                errorSpan.textContent = "";
                setValidationIcon(name, true)
            }
        }
    } else {
        // gtag('event', `second-step-completed`, {
        //     'event_label': `second-step-completed`,
        // });
        navigateStep(3, 2)
    }
}

function validateFourthStep() {
    const phoneDynamicField = document.querySelector('.phone-number-field');

    if (!formData.email || !formData.fullname || !formData.phone) {
        const filedsToValidate = [
            {
                name: 'email',
                errorSpan: document.getElementById('email-error'),
                errorMessage: "Please enter a valid name."
            },
            {
                name: 'fullname',
                errorSpan: document.getElementById('fullname-error'),
                errorMessage: 'You Need To Choose One Option.'
            },
            {
                name: 'phone',
                errorSpan: document.getElementById('phone-error'),
                errorMessage: "Please enter a valid phone number."
            },
        ]

        for (const { name, errorSpan, errorMessage } of filedsToValidate) {
            if (!formData[name]) {
                errorSpan.textContent = errorMessage;
                setValidationIcon(name, false)
            } else {
                errorSpan.textContent = "";
                setValidationIcon(name, true)
            }
        }
    } else {
        phoneDynamicField.textContent = formData.phone;

        sendVerificationCode(formData.phone)
        displayFormHeaderAndFooter(false);
        navigateStep(5, 4)
        // gtag('event', `fourth-step-completed`, {
        //     'event_label': `fourth-step-completed`,
        // });
    }
}

async function validateOtp(errorId) {
    const otp = collectOTP();
    const otpInputs = document.querySelectorAll('.otp-input');
    const errorSpan = document.getElementById(errorId);


    if (otp && otp.length === 4) {
        const isOTPValid = await confirmOTP(formData.phone, otp);

        if (isOTPValid) {
            errorSpan.textContent = "";
            navigateStep(6, 5)

            // gtag('event', `otp-verification`, {
            //     'event_label': `otp-verification`,
            // });
        }
    } else {
        otpInputs.forEach((input) => {
            input.classList.add("error");
        });
        errorSpan.textContent = "Please enter a valid PIN code.";
    }

    console.log(formData);
}