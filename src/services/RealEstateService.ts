import type { RealEstate } from '../types';

export function calculateNetValue(realEstate: RealEstate | null, loanBalance: number): number {
    if (!realEstate) return 0;

    const brokerFees = realEstate.sellingPrice * (realEstate.brokerFeePercentage / 100) * 1.21;
    return realEstate.sellingPrice - brokerFees - realEstate.earlyRepaymentFine - loanBalance;
}

export function calculateBrokerFees(price: number, percentage: number): number {
    return price * (percentage / 100) * 1.21;
}
