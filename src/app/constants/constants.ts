const TEST = {
    APP_VERSION: '0.1',
    ADMOB_APP_ID: {
        ANDROID: 'ca-app-pub-5607778480081128/6890748421',
        IOS: 'ca-app-pub-5607778480081128/6479684882'
    },
    // API_ENDPOINT: 'https://ccapi-dev.cricclubs.com/',
    // RESOURCE_URL: 'https://www-dev.cricclubs.com',
    API_ENDPOINT: 'https://ccapi-test.cricclubs.com/',
    RESOURCE_URL: 'https://www-test.cricclubs.com',
    CASHFREE: {
        DEPOSITE_URL: 'https://cricclubs.com/cashFreePGCheckOut.do?',
        DEPOSITE_SUCCESS_URL: '/cashFreePaymentSuccessURL.do',
        DEPOSITE_FAILURE_URL: '/cashFreePaymentFailureURL.do',
        DEPOSITE_PENDING_URL: '/cashFreePaymentPendingURL.do'
    },
    STRIPE: {
        DEPOSITE_URL: 'https://cricclubs.com/stripePGCheckOut.do?',
        DEPOSITE_SUCCESS_URL: '/stripeAPIPaymentSuccessURL.do',
        DEPOSITE_FAILURE_URL: '/stripeAPIPaymentFailureURL.do'
    },
    PAYMENT_MESSAGE: {
        SUCCESS: 'Payment successful',
        FAILURE: 'Payment failed',
        PENDING: 'Your payment is in pending state. Please check back again.'
    },
    RAZORPAY_KEY_ID: 'rzp_live_CTyQcaNvZQg7JP'
};

const PRODUCTION = {
    APP_VERSION: '0.1',
    ADMOB_APP_ID: {
        ANDROID: 'ca-app-pub-5607778480081128/6890748421',
        IOS: 'ca-app-pub-5607778480081128/6479684882'
    },
    API_ENDPOINT: 'https://ccapi.cricclubs.com/',
    RESOURCE_URL: 'https://cricclubs.com',
    CASHFREE: {
        DEPOSITE_URL: 'https://cricclubs.com/cashFreePGCheckOut.do?',
        DEPOSITE_SUCCESS_URL: '/cashFreePaymentSuccessURL.do',
        DEPOSITE_FAILURE_URL: '/cashFreePaymentFailureURL.do',
        DEPOSITE_PENDING_URL: '/cashFreePaymentPendingURL.do'
    },
    STRIPE: {
        DEPOSITE_URL: 'https://cricclubs.com/stripePGCheckOut.do?',
        DEPOSITE_SUCCESS_URL: '/stripeAPIPaymentSuccessURL.do',
        DEPOSITE_FAILURE_URL: '/stripeAPIPaymentFailureURL.do'
    },
    PAYMENT_MESSAGE: {
        SUCCESS: 'Payment successful',
        FAILURE: 'Payment failed',
        PENDING: 'Your payment is in pending state. Please check back again.'
    },
    RAZORPAY_KEY_ID: 'rzp_live_CTyQcaNvZQg7JP'
};

// set CONSTANTS to be TEST if 'environment' is not set or set to 'TEST'
export const CONSTANTS = (!localStorage.getItem('environment') || localStorage.getItem('environment') == 'TEST') ? TEST : PRODUCTION;
