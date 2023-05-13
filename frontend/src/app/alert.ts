export interface Alert {
    _id: string;
    deviceId: string;
    unitLimit: number;
    isSent: boolean;
    sentDate: Date;
    alertType: string;
}