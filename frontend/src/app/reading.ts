export interface Reading {
    _id: string;
    accountId: string;
    deviceId: string;
    usage: number;
    usedAt: Date;
}