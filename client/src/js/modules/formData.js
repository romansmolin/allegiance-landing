const formData = {};

// TODO: Refator code

function updatePropertyType(propertyType) {
    formData["propertyType"] = propertyType;
}

function updateZipCode(inputId, zipCode) {
    formData[inputId] = zipCode
}

function updatePropertySize(size) {
    formData["movesize"] = size;
}

function updateMovingDate(movingDate) {
    formData["movedte"] = movingDate;
}

function updateName(inputId, name) {
    formData[inputId] = name;
}

function updateEmail(inputId, email) {
    formData[inputId] = email;
}

function updatePhone(inputId, phone) {
    formData[inputId] = phone;
}

function updateCountry(country, type) {
    formData[`${type}Country`] = country;
}