import { ISong } from "../Song";

export interface ISpeaker {
	id: string,
	name: string
}

export interface ISpeakerGroup {
	id: string
	speakers: ISpeaker[]
}

export type SpeakersCallback = (speakerGroups: ISpeakerGroup[]) => void

export interface IInfoService {
	setGroupUpdateCallback: (callback: SpeakersCallback) => void
}