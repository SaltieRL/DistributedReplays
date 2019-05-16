import * as React from "react"
import { BoostField } from "./BoostField"

interface Props {
    data: any
}

interface State {

}

export class BoostMapWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null, reloadSignal: false}
    }

    public render() {
        const {data} = this.props
        let ratios = data.map((pad: any) => {
            const totalCount = pad.length
            const blueCount = pad.filter((pickup: any) => pickup.playerTeam === 0).length
            const orangeCount = totalCount - blueCount
            return [blueCount / totalCount, orangeCount / totalCount]
        })

        return (
            <>
                <BoostField data={
                    ratios
                }/>
            </>
        )
    }

}
