import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography
} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import * as React from "react"
import {Link} from "react-router-dom"
import {PLAYER_COMPARE_WITH_LINK} from "../../../../Globals"
import {IconTooltip} from "../../../Shared/IconTooltip"
import {PlayStyleExplanationTable} from "./PlayStyleExplanationTable"

interface Props {
    player: Player
}

interface State {
    dialogOpen: boolean
}

export class PlayerPlayStyleCard extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {dialogOpen: false}
    }

    public render() {
        /* tslint:disable */
        const playStyleTitle =
            <Typography variant="headline">
                Playstyle
                <IconTooltip
                    tooltip="Data is presented as standard deviations from the mean, and only includes games from the past 6 months"/>
            </Typography>
        /* tslint:enable */

        const playStyleAction =
            <>
                <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                    <Tooltip title="Compare with...">
                        <IconButton style={{marginRight: 8}}>
                            <CompareArrows/>
                        </IconButton>
                    </Tooltip>
                </Link>
                <Button variant="outlined"
                        onClick={this.handleOpen}
                        style={{marginRight: 8}}
                >
                    What are these stats?
                </Button>
                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Explanation of terms</DialogTitle>
                    <DialogContent>
                        <PlayStyleExplanationTable/>
                    </DialogContent>
                </Dialog>
            </>

        return (
            <Card>
                <CardHeader title={playStyleTitle} action={playStyleAction}/>
                <CardContent>
                    {this.props.children}
                </CardContent>
            </Card>
        )
    }

    private readonly handleOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleClose = () => {
        this.setState({dialogOpen: false})
    }
}
