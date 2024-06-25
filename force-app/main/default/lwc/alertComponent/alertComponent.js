import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningAlert from 'lightning/alert';

const ALERT_TYPES = {
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
};

const DISPLAY_METHODS = {
    ALERT: 'alert',
    TOAST: 'toast'
};

const ALERT_DISPLAY_TYPES = {
    POPUP: 'popup',
    BANNER: 'banner',
};

const TOAST_MODES = {
    DISMISSABLE: 'dismissable',
    STICKY: 'sticky',
    PESTER: 'pester'
};

const ICON_NAMES = {
    [ALERT_TYPES.WARNING]: 'utility:warning',
    [ALERT_TYPES.ERROR]: 'utility:error',
    [ALERT_TYPES.INFO]: 'utility:info'
};

const ALERT_TYPE_CLASSES = {
    [ALERT_TYPES.WARNING]: 'slds-notify slds-notify_alert slds-alert_warning',
    [ALERT_TYPES.ERROR]: 'slds-notify slds-notify_alert slds-alert_error',
    [ALERT_TYPES.INFO]: 'slds-notify slds-notify_alert slds-alert_info'
};

export default class AlertComponent extends LightningElement {
    @api type; 
    @api alertType; 
    @api displayMethod; 
    @api message; 
    @api alertTitle; 

    @track showAlert = false;

    connectedCallback() {
        this.showAlert = true;
        if (this.type === ALERT_DISPLAY_TYPES.POPUP) {
            if (this.displayMethod === DISPLAY_METHODS.ALERT) {
                this.showLightningAlert();
            } else {
                this.showLightningToast();
            }
        }
    }

    async showLightningAlert() {
        try {
            await LightningAlert.open({
                message: this.message,
                theme: ALERT_TYPES[this.alertType.toUpperCase()],
                label: this.alertTitle
            });
        } catch (error) {
            console.error('Error displaying alert:', error);
        } finally {
            this.showAlert = false;
        }
    }

    showLightningToast() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: this.alertTitle,
                message: this.message,
                variant: ALERT_TYPES[this.alertType.toUpperCase()],
                mode: TOAST_MODES.DISMISSABLE
            })
        );

        this.showAlert = false;
    }

    get isBanner() {
        return this.type === ALERT_DISPLAY_TYPES.BANNER;
    }

    get isDismissable() {
        return this.type === ALERT_DISPLAY_TYPES.DISMISSABLE;
    }

    get bannerClass() {
        return ALERT_TYPE_CLASSES[this.alertType];
    }

    get iconName() {
        return ICON_NAMES[this.alertType];
    }

    closeBanner() {
        this.showAlert = false;
    }
}