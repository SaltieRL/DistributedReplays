import {Card, CardHeader} from "@material-ui/core"
import * as React from "react"
import {FullMatchHistoryLinkButton} from "./FullMatchHistoryLinkButton"

interface Props {
    player: Player
}

export class PlayerMatchHistoryCard extends React.PureComponent<Props> {
    public render() {
        return (
            <Card>
                <CardHeader title="Match History" action={<FullMatchHistoryLinkButton player={this.props.player} />} />
                {this.props.children}
            </Card>
        )
    }
}
