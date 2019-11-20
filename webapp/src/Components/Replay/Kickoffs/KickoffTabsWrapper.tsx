import {Divider, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {Replay} from "../../../Models"
import {getKickoffs} from "../../../Requests/Replay"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {KickoffField} from "./KickoffField"
import {KickoffMapWrapper} from "./KickoffMapWrapper"
import {KickoffTabs} from "./KickoffTabs"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps & WithWidth

interface State {
    kickoffData: any
    kickoff: any
    selectedTab: number
    reloadSignal: boolean
}

class KickoffTabsWrapperComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            kickoffData: null,
            kickoff: null,
            selectedTab: 0,
            reloadSignal: false
        }
    }

    public render() {
        const belowXs = isWidthDown("xs", this.props.width)

        return (
            <LoadableWrapper load={this.getKickoffsData} reloadSignal={this.state.reloadSignal}>
                <Divider />
                <div style={{display: "flex", flexDirection: belowXs ? "column" : "row"}}>
                    <KickoffTabs
                        selectedTab={this.state.selectedTab}
                        handleChange={this.handleSelectTab}
                        kickoffData={this.state.kickoffData}
                        orientation={belowXs ? "horizontal" : "vertical"}
                    />
                    {this.state.kickoffData === null ? (
                        ""
                    ) : this.state.selectedTab === 0 ? (
                        this.getMergedKickoff(this.state.kickoffData)
                    ) : (
                        <KickoffMapWrapper
                            kickoffIndex={this.state.selectedTab - 1}
                            replay={this.props.replay}
                            kickoffData={this.state.kickoffData.kickoffs[this.state.selectedTab - 1]}
                            players={this.state.kickoffData.players}
                        />
                    )}
                </div>
            </LoadableWrapper>
        )
    }

    private readonly getKickoffsData = () => {
        return getKickoffs(this.props.replay.id).then((kickoffData) => this.setState({kickoffData}))
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: number) => {
        this.setState({selectedTab})
    }

    private readonly getMergedKickoff = (kickoffData: any) => {
        const mergedPlayers: any[] = kickoffData.kickoffs.reduce((p: any, q: any) => p.concat(q.players), [])
        const belowXs = isWidthDown("xs", this.props.width)
        return (
            <KickoffField
                playerList={mergedPlayers}
                players={kickoffData.players}
                width={belowXs ? 500 : 1000}
                height={belowXs ? 350 : 700}
            />
        )
    }
}

export const KickoffTabsWrapper = withWidth()(KickoffTabsWrapperComponent)
