import {Card, CardContent, CardHeader} from "@material-ui/core"
import * as React from "react"

interface Props {
    player: Player
}

export class PlayerMatchHistory extends React.PureComponent<Props> {
    public render() {
        return (
            <Card>
                <CardHeader title="Match History"/>
                <CardContent>
                    Placeholder
                </CardContent>
            </Card>
        )
    }
}
