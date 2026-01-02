export interface RealEstate {
    name: string;
    sellingPrice: number;
    brokerFeePercentage: number;
    earlyRepaymentFine: number;
}

export interface LoanPayment {
    interest: number;
    principal: number;
}

export interface LoanData {
    totalLoaned: number;
    monthlyPayments: { [month: string]: LoanPayment };
}
