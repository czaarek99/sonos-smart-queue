import { IControlController, ControlState } from "../interfaces/controllers/ControlController";
import { observable } from "mobx";

const EMPTY_SONG = {
	name: "",
	artistName: "",
	albumUrl: "/album.png"
}

export class ControlController implements IControlController {

	@observable public currentlyPlaying = EMPTY_SONG;
	@observable public state = ControlState.INACTIVE;
	@observable public volume = 50;

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