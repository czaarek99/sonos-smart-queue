import { ISpeakerGroup } from "../services/InfoService";

export interface IGroupChooserController {
    readonly groups: ISpeakerGroup[]
    readonly selectedId: string
    readonly loading: boolean

    onSelect: (id: string) => void
}