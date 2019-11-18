import * as React from "react"
import { BasicStat } from "../../../Models"
import { BasicStatsTable } from "./BasicStatsTable"

interface Props {
    style: React.CSSProperties
    basicStats: BasicStat[]
}

interface State {
    scrollPosition: number
    scrollDiv?: any
}

export class TableScrollWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            scrollPosition: 0,
            scrollDiv: null
        }
    }

    public render() {
        return (
            <div
                style={this.props.style}
                ref={(e) => {
                    this.setState({scrollDiv: e})
                }}
                onScroll={this.listenToScroll}
            >
                <BasicStatsTable basicStats={this.props.basicStats} scrollLeft={this.state.scrollPosition}/>
            </div>
        )
    }

    private readonly listenToScroll = () => {
        const winScroll =
            this.state.scrollDiv.scrollLeft
        this.setState({
            scrollPosition: winScroll
        })
    }
}
