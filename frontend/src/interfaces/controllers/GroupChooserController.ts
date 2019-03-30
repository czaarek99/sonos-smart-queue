import { ISpeakerGroup } from "../services/InfoService";

export interface IGroupChooserController {
	readonly groups: ISpeakerGroup[]
	readonly selectedId: string

	onSelect: (id: string) => void
}