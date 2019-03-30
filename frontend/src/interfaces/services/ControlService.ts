import { ISong } from "../Song";

export interface IPlaying {
	playing: ISong
}

export type PlayingCallback = (song: IPlaying) => void

export interface IControlService {
	setPlayingUpdateCallback: (groupId: string, callback: PlayingCallback) => void
}