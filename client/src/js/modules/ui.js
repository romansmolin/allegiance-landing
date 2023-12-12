const formHeader = document.querySelector('.main__form__header');
const formCompanies = document.querySelector('.main__form__companies');
const footerDiscalimer = document.querySelector('.main__footer__disclaimer');
const loaderText = document.querySelector(".loader__text");

let currentStep = 1;

function navigateStep(direction = "forward") {

    let nextStep;

    hideAllSteps(currentStep);

    if (direction === "forward") {
        nextStep = currentStep + 1;
        currentStep++;
    } else {
        nextStep = currentStep - 1;
        currentStep = currentStep - 1;
        if (nextStep < 1) {
            console.error("Cannot navigate below Step 1");
            return;
        }
    }

    console.log('Current step - ' + currentStep);
    console.log('Next step - ' + nextStep);

    const nextStepElement = document.getElementById(`step-${nextStep}`).style.display = "flex";

    if (!nextStepElement) {
        console.error(`Step element not found: step-${nextStep}`);
        return;
    }

    const handleStepsObj = {
        1: () => showBackBtn(false),
        2: () => showBackBtn(true),
        3: handleStep3,
        4: () => stickFooterToBottom(3, true),
        5: () => stickFooterToBottom(5),
        6: () => handleStep6,
    }

    const handler = handleStepsObj[nextStep];

    if (handler) {
        handler();
    }

    updateProgress(nextStep, direction)
}

function handleStep3() {
    displayFormHeaderAndFooter(false);
    stickFooterToBottom(3);
    activateLoader();
    showBackBtn(false);
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

function showBackBtn(isShow = false) {
    const backBtn = document.querySelector('.back-btn');
    const adjacentH2 = backBtn.nextElementSibling;

    isShow 
        ? (backBtn.classList.add('show'), adjacentH2.classList.add('hide')) 
        : (backBtn.classList.remove('show'), adjacentH2.classList.remove('hide'));
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
            navigateStep("forward");
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });


}

function updateProgress(nextStep, direction) {
    const mobileStepsProgress = document.querySelectorAll('.mobile-steps div');
    const desktopStepsProgress = document.querySelectorAll('.desktop-steps div')

    const handlingSteps = {
        forward: {
            2: () => {
                desktopStepsProgress[1].classList.add('progress');
                mobileStepsProgress[1].classList.add('progress');
            },
            4: () => {
                desktopStepsProgress[2].classList.add('progress');
                mobileStepsProgress[2].classList.add('progress');
            },
        },
        backward: {
            1: () => {
                desktopStepsProgress[0].classList.add('progress');
                mobileStepsProgress[0].classList.add('progress');
            },
            2: () => {
                desktopStepsProgress[1].classList.remove('progress');
                mobileStepsProgress[1].classList.remove('progress');
            },
        },
    };

    if (handlingSteps[direction] && handlingSteps[direction][nextStep]) {
        handlingSteps[direction][nextStep]();
    }
}

