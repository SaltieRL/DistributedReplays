import {CardContent, Divider} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import {Replay} from "../../../Models"
import {getKickoffs} from "../../../Requests/Replay"
import {LoadableWrapper} from "../../Shared/LoadableWrapper"
import {KickoffContent} from "./KickoffContent"
import {KickoffTabs} from "./KickoffTabs"
import {KickoffField} from "./KickoffField";

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
                    <Divider/>

                    <KickoffTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}
                                 kickoffData={this.state.kickoffData}/>
                        <CardContent>
                            <Grid container spacing={32}>
                                {
                                    this.state.kickoffData == null? "":
                                    this.state.selectedTab == 0 ?
                                        this.getMergedKickoff(this.state.kickoffData)
                                        :
                                        <KickoffContent key={this.state.selectedTab - 1}
                                                        kickoffIndex={this.state.selectedTab - 1}
                                                        replay={this.props.replay}
                                                        kickoffData={this.state.kickoffData.kickoffs[this.state.selectedTab - 1]}
                                                        players={this.getPlayerData()} />
                                }
                            </Grid>
                        </CardContent>

                </>
            </LoadableWrapper>
        )
    }

    private readonly getKickoffsData = () => {
        return getKickoffs(this.props.replay.id)
            .then((data) => this.setState({kickoffData: data}))
    }

    private readonly getPlayerData = () => {
        return this.state.kickoffData.players
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: number) => {
        this.setState({selectedTab})
    }

    private readonly getMergedKickoff = (kickoffData: any) => {
        let merged_players: any[] = []

        kickoffData.kickoffs.map((kickoff: any) => {
            merged_players=merged_players.concat(kickoff.players)
        })

        return (
            <KickoffField key={0}
                          player_list={merged_players}
                          players={kickoffData.players}
                          width={1000}
                          height={700}
            />)

    }
}
