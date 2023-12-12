const formHeader = document.querySelector('.main__form__header');
const formCompanies = document.querySelector('.main__form__companies');
const footerDiscalimer = document.querySelector('.main__footer__disclaimer');
const loaderText = document.querySelector(".loader__text");

function navigateStep(nextStep, currentStep) {
    hideAllSteps(currentStep);
    const nextStepElement = document.getElementById(`step-${nextStep}`).style.display = "flex";

    if (!nextStepElement) {
        console.error(`Step element not found: step-${nextStep}`);
        return;
    }

    const handleStepsObj = {
        3: handleStep3,
        4: () => stickFooterToBottom(3, true),
        5: () => stickFooterToBottom(5),
        6: () => handleStep6,
    }

    const handler = handleStepsObj[nextStep];

    if (handler) {
        handler();
    }
}

function handleStep3() {
    displayFormHeaderAndFooter(false);
    stickFooterToBottom(3);
    activateLoader();
}

function handleStep6() {
    const headerPhoneLink = document.querySelector('.form__header__phone');
    const companiesFooter = document.querySelector('.companies');

    stickFooterToBottom(6);
    stickFooterToBottom(6, true); // Remove classes

    if (headerPhoneLink) {
        headerPhoneLink.style.display = "none";
    }

    if (companiesFooter) {
        companiesFooter.style.display = "none";
    }
}

function hideAllSteps(currentStep) {
    let step = document.querySelector(`.step-${currentStep}`);
    step.style.display = "none"
}

function simulateLoading(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

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
