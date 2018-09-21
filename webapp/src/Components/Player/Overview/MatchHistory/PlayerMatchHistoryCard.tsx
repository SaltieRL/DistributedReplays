import {Card, CardHeader} from "@material-ui/core"
import ViewList from "@material-ui/icons/ViewList"
import * as React from "react"
import {PLAYER_MATCH_HISTORY_PAGE} from "../../../../Globals"
import {LinkButton} from "../../../Shared/LinkButton"

interface Props {
    player: Player
}

export class PlayerMatchHistoryCard extends React.PureComponent<Props> {
    public render() {
        return (
            <Card>
                <CardHeader title="Match History"
                            action={
                                <div style={{marginRight: 8}}>
                                    <LinkButton to={PLAYER_MATCH_HISTORY_PAGE(this.props.player.id)}
                                                tooltip="View full match history"
                                                icon={ViewList} iconType="mui"
                                    >
                                        View full
                                    </LinkButton>
                                </div>
                            }
                />
                {this.props.children}
            </Card>
        )
    }
}
