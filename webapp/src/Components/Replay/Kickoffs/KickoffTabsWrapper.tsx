import {CardContent, Divider} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import {Replay} from "../../../Models"
import {getKickoffs} from "../../../Requests/Replay"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {KickoffContent} from "./KickoffContent"
import {KickoffField} from "./KickoffField"
import {KickoffTabs} from "./KickoffTabs"

interface Props {
    replay: Replay
}

interface State {
    kickoffData: any
    kickoff: any
    selectedTab: number
    reloadSignal: boolean
}

export class KickoffTabsWrapper extends React.PureComponent<Props, State> {
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
        return (
            <LoadableWrapper load={this.getKickoffsData} reloadSignal={this.state.reloadSignal}>
                <>
                    <Divider />

                    <KickoffTabs
                        selectedTab={this.state.selectedTab}
                        handleChange={this.handleSelectTab}
                        kickoffData={this.state.kickoffData}
                    />
                    <CardContent>
                        <Grid container spacing={4}>
                            {this.state.kickoffData === null ? (
                                ""
                            ) : this.state.selectedTab === 0 ? (
                                this.getMergedKickoff(this.state.kickoffData)
                            ) : (
                                <KickoffContent
                                    kickoffIndex={this.state.selectedTab - 1}
                                    replay={this.props.replay}
                                    kickoffData={this.state.kickoffData.kickoffs[this.state.selectedTab - 1]}
                                    players={this.state.kickoffData.players}
                                />
                            )}
                        </Grid>
                    </CardContent>
                </>
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

        return <KickoffField playerList={mergedPlayers} players={kickoffData.players} width={1000} height={700} />
    }
}
