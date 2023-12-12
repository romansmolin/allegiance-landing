const selectedFlag = document.querySelector('.iti__selected-flag');
const flagContainer = document.querySelector('.iti__flag-container');
const listOfCountries = document.getElementById('iti-0__country-listbox');
let isClicked = false;

selectedFlag.addEventListener('click', () => {
    const isMobile = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && document.body.classList.contains('iti-mobile')) {
        const wrapper = document.getElementById('wrapper-for-iti');
        const container = document.querySelector('.iti--container');
    
        // Clear all style properties of iti--container
        container.style.cssText = '';
    
        // Remove iti-mobile class from the body
        // document.body.classList.remove('iti-mobile');
    
        // Set specific width and height properties for iti--container
        container.style.width = '100%';
        container.style.height = '150px';
    
        // Additional properties to unset
        container.style.right = 'unset';
        container.style.left = 'unset';
        container.style.bottom = 'unset';
        container.style.top = 'unset';
        container.style.position = 'relative';

    
        // Append the container to the wrapper
        wrapper.appendChild(container);
    }

    if (!isClicked) {
        flagContainer.style.width = '100%';
        listOfCountries.style.width = '100%';
        isClicked = true;
    } else {
        flagContainer.style.width = '';
        listOfCountries.style.width = '';
        isClicked = false;
    }
})

const countryItems = document.querySelectorAll('.iti__country');

countryItems.forEach(countryItem => {
    countryItem.addEventListener('click', () => {

        flagContainer.style.width = '';
        listOfCountries.style.width = '';
        isClicked = false;
    });
});



const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
        const value = e.target.value;
        if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus(); // Move focus to the next input
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            // Only allow single digits
            e.preventDefault();
            input.value = e.key;
        }
    });
});