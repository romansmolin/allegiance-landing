function isStepVisible(stepNumber) {
    const step = document.getElementById(`step-${stepNumber}`);
    return window.getComputedStyle(step).display === 'flex';
}

function collectOTP() {
    let otp = "";
    for (let i = 1; i <= 4; i++) {
        let digit = document.getElementById(`otp-${i}`).value;
        otp += digit;
    }

    return otp;
}

function setValidationIcon(inputId, isOkay) {
    const iconPath = isOkay ? "src/icons/correct.svg" : "src/icons/wrong.svg";
    const iconAlt = isOkay ? "Validation Passed" : "Validation Failed";

    // Find the closest ancestor with the class "input-icon"
    const inputIcon = document.querySelector(`.input-icon.${inputId}`)

    if (!inputIcon) {
        console.error("No .input-icon found for the input element with id:", inputId);
        return;
    }

    let validationIcon = inputIcon.querySelector("img");

    if (!validationIcon) {
        validationIcon = document.createElement("img");
        inputIcon.appendChild(validationIcon);
    }

    validationIcon.src = iconPath;
    validationIcon.alt = iconAlt;
}

function setCountry(isUSZipCode, isCAPostalCode, zipCode, inputId) {
    if (isUSZipCode) {
        updateCountry('US', inputId)
    } else if (isCAPostalCode) {
        updateCountry('CA', inputId)
    } else {
        return 'Unknown';
    }
}

function validateFieldsOnChangingStep(filedsToValidate) {
    for (const { name, errorSpan, errorMessage } of filedsToValidate) {
        if (!formData[name]) {
            errorSpan.textContent = errorMessage;
            if (name !== 'propertyType') {
                setValidationIcon(name, false)
            }
        } else {
            errorSpan.textContent = "";
            if (name !== 'propertyType') {
                setValidationIcon(name, true)
            }
        }
    }
}