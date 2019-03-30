import { IControlController, ControlState } from "../interfaces/controllers/ControlController";
import { observable, computed } from "mobx";
import { AppController } from "./AppController";
import { ISong } from "../interfaces/Song";

export class ControlController implements IControlController {

	private readonly appController: AppController;
	@observable public state = ControlState.INACTIVE;
	@observable public volume = 50;

	constructor(appController: AppController) {
		this.appController = appController;
	}

	@computed public get currentlyPlaying() {
		return this.appController.getCurrentlyPlaying();
	}

	public onPause() {
		this.state = ControlState.PAUSED;
	}

	public onPlay() {
		this.state = ControlState.PLAYING;
	}

	public onVolumeChange(volume: number) {
		this.volume = volume;
	}

	public onSkip() {}
	public onPrev() {}

}