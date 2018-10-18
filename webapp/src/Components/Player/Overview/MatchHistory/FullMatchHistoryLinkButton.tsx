import ViewList from "@material-ui/icons/ViewList"
import * as React from "react"
import { PLAYER_MATCH_HISTORY_PAGE_LINK } from "../../../../Globals"
import { LinkButton } from "../../../Shared/LinkButton"

interface Props {
    player: Player
}

export class FullMatchHistoryLinkButton extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{marginRight: 8}}>
                <LinkButton to={PLAYER_MATCH_HISTORY_PAGE_LINK(this.props.player.id)}
                            tooltip="View full match history"
                            icon={ViewList} iconType="mui"
                >
                    View full
                </LinkButton>
            </div>
        )
    }
}
