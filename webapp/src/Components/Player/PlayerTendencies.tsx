import {Card, CardContent, CardHeader} from "@material-ui/core"
import * as React from "react"

interface Props {
    player: Player
}

export class PlayerTendencies extends React.PureComponent<Props> {
    public render() {
        return (
            <Card>
                <CardHeader title="Playstyle"/>
                <CardContent>
                    Placeholder
                </CardContent>
            </Card>
        )
    }
}
