import { ISong } from "../Song";

export interface ISpeaker {
	id: string,
	name: string
}

export interface ISpeakerGroup {
	id: string
	speakers: ISpeaker[]
}

export interface IInfoService {
}