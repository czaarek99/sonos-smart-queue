import { ILoginModel } from "../interfaces/models/LoginModel";
import { observable } from "mobx";

export class LoginModel implements ILoginModel {

	@observable public username: string = "";
	@observable public password: string = "";

}