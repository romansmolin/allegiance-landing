const formHeader = document.querySelector('.main__form__header');
const formCompanies = document.querySelector('.main__form__companies');
const footerDiscalimer = document.querySelector('.main__footer__disclaimer');
const loaderText = document.querySelector(".loader__text");

function displayFormHeaderAndFooter(isShow) {
    if (!isShow) {
        formHeader.style.display = 'none';
        formCompanies.style.display = 'none';
        footerDiscalimer.style.display = 'none';
    } else {
        formHeader.style.display = 'flex';
        formCompanies.style.display = 'flex';
        footerDiscalimer.style.display = 'block';
    }     
}

function stickFooterToBottom(step) {
    const main = document.getElementById('main');
    const mainFooter = document.querySelector('.main__footer');

    main.classList.add(`main__heigth_step-${step}`);
    mainFooter.classList.add(`footer-step-${step}`);
}

//HANDLING NEXT STEPS IN FORM

function navigateStep(nextStep, currentStep) {

    hideAllSteps(currentStep);
    document.getElementById(`step-${nextStep}`).style.display = "flex";

    if (isStepVisible(3)) {
        displayFormHeaderAndFooter(false)
        stickFooterToBottom(3)
        activateLoader();
    }

    if (isStepVisible(5)) {
        stickFooterToBottom(5)
    }

    if (isStepVisible(6)) {
        const headerPhoneLink = document.querySelector('.form__header__phone');
        const companiesFooter = document.querySelector('.companies');

        stickFooterToBottom(6)

        headerPhoneLink.style.display = "none";
        companiesFooter.style.display = "none";
    }
}


function hideAllSteps(currentStep) {
    let step = document.querySelector(`.step-${currentStep}`);
    step.style.display = "none"
}


// Function to simulate loading with a delay
function simulateLoading(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

// LOADER

function activateLoader() {
    const loaderContainer = document.querySelector('.loader__container');
    const loader = document.querySelector('.loader');
    const loaderSuccess = document.querySelector('.success');

    simulateLoading(5000)
        .then(() => {
            loaderContainer.removeChild(loader);
            loaderText.textContent = 'Done! Now enter your details.';
            loaderSuccess.style.display = 'flex';
            return simulateLoading(2000);
        })
        .then(() => {
            // gtag('event', `third-step-loading-completed`, {
            //     'event_label': `third-step-loading-completed`,
            // });
            displayFormHeaderAndFooter(true);
            navigateStep(4, 3);
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });


}
