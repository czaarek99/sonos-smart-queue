import { IControlController, ControlState } from "../interfaces/controllers/ControlController";
import { observable } from "mobx";
import { AppController } from "./AppController";
import { ISong } from "../interfaces/Song";

export class ControlController implements IControlController {

	private readonly appController: AppController;
	@observable public currentlyPlaying : ISong = null;
	@observable public state = ControlState.INACTIVE;
	@observable public volume = 50;

	constructor(appController: AppController) {
		this.appController = appController;
		this.load();
	}

	private async load() {
		this.updatePlaying();

		/*setInterval(() => {
			this.updatePlaying();
		}, 1000)*/
	}

	private async updatePlaying() {
		const groupId = this.appController.getGroupId();
		if(groupId) {
			this.currentlyPlaying = await this.appController.getServices()
				.infoService.getCurrentlyPlaying(groupId);
		}
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