import {IPlan} from "@/types/plan";
import {IUser} from "@/types/user";

export interface IPayment {
    id: string;
    userId: string;
    totalPrice: number;
    currency: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    paymentProofImage: string | null;
    createdAt: string;
    user: IUser | null;
    itemPack: IPlan | null;
    customTokenAmount: number | null;
}
