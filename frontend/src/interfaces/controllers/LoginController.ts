import { ILoginModel } from "../models/LoginModel";

export interface ILoginController {
    readonly loading: boolean;
    readonly error: string;
    readonly model: ILoginModel;
    onChange: (key: keyof ILoginModel, value: string) => void
    onLogin: () => Promise<void>
    onRegister: () => Promise<void>
}