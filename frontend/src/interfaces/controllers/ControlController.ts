import { ISong } from "../Song";

export enum ControlState {
    PAUSED,
    PLAYING,
    INACTIVE
}

export interface IControlController {
    readonly currentlyPlaying: ISong
    readonly state: ControlState 
    readonly volume: number

    onVolumeChange: (volume: number) => void
    onPause: () => void
    onPlay: () => void
    onSkip: () => void
    onPrev: () => void
}