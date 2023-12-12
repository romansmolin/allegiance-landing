function sendVerificationCode(phoneNumber) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
    };

    fetch('/send-verification', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => console.log(responseData))
        .catch(error => console.error('Error sending verification code:', error.message || error));
}

async function confirmOTP(phoneNumber, otp) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, code: otp }),
    };

    return fetch('/confirm-otp-code', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.valid) {
                console.log('Verification code is approved');
                return true;
            } else {
                console.error('Invalid OTP code');
                return false;
            }
        })
        .catch(error => {
            console.error('Error confirming OTP code:', error.message || error);
            return false;
        });
}

async function getCityAndState(zipCode, country) {
    const apiKey = 'AIzaSyALi6BN0vdvo28FYyrPUt_k0v656lHdT6E' // Geocoding API GOOGLE
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&components=country:${country}|postal_code:${zipCode}&sensor=false&key=${apiKey}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            return data; 
        })
        .catch(err => {
            console.error(err);
            throw err; 
        });
}

