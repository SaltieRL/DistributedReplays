import { CardContent, Divider } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import { Replay } from "../../../Models"
import { getKickoffs } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { KickoffContent } from "./KickoffContent"
import { KickoffTabs } from "./KickoffTabs"

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

    // public componentDidMount() {
    //     const config = {container: ReactDOM.findDOMNode(this) as HTMLElement}
    //     const kickoff = h337.create(config)
    //     this.setState({kickoff})
    // }

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
                                    this.state.selectedTab == 0 ? "Hello" :
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
}
