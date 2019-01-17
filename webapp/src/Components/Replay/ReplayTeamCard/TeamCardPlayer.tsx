import { faCamera, faCarSide } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    Dialog,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip
} from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { PLAYER_PAGE_LINK } from "../../../Globals"
import { CameraSettingsDisplay } from "./CameraSettingsDisplay"
import { LoadoutDisplay } from "./LoadoutDisplay"

interface Props {
    player: ReplayPlayer
    predictedRank: number
}

interface State {
    cameraOpen: boolean
    loadoutOpen: boolean
}

export class TeamCardPlayer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {cameraOpen: false, loadoutOpen: false}
    }

    public render() {
        const {player, predictedRank} = this.props

        const carButton = (
            <Tooltip title="Loadout">
                <IconButton onClick={this.handleShowLoadout}>
                    <FontAwesomeIcon icon={faCarSide}/>
                </IconButton>
            </Tooltip>
        )

        const cameraButton = (
            <Tooltip title="Camera settings">
                <IconButton onClick={this.handleShowCamera}>
                    <FontAwesomeIcon icon={faCamera}/>
                </IconButton>
            </Tooltip>
        )
        const showRankImg = false
        const rankImg = (
            <img src={`${window.location.origin}/ranks/${predictedRank}.png`}
                 style={{width: 48, height: 48, margin: "auto"}}/>
        )

        return (
            <>
                <ListItem button key={player.id}
                          component={this.createLink}>
                    {showRankImg && rankImg}
                    <ListItemText primary={player.name} primaryTypographyProps={{noWrap: true}}
                                  style={{padding: "0 64px 0 0"}}/>
                    <ListItemSecondaryAction>
                        {carButton}
                        {cameraButton}
                    </ListItemSecondaryAction>
                </ListItem>
                <Dialog open={this.state.loadoutOpen} onClose={this.handleCloseLoadout}>
                    <DialogTitle>{this.props.player.name}'s Loadout</DialogTitle>
                    <LoadoutDisplay loadout={this.props.player.loadout}/>
                </Dialog>
                <Dialog open={this.state.cameraOpen} onClose={this.handleCloseCamera}>
                    <DialogTitle>{this.props.player.name}'s Camera Settings</DialogTitle>
                    <CameraSettingsDisplay cameraSettings={this.props.player.cameraSettings}/>
                </Dialog>
            </>
        )
    }

    private readonly createLink = (props: {}) => <Link to={PLAYER_PAGE_LINK(this.props.player.id)} {...props}/>

    private readonly handleShowCamera = () => {
        this.setState({cameraOpen: true})
    }

    private readonly handleCloseCamera = () => {
        this.setState({cameraOpen: false})
    }

    private readonly handleShowLoadout = () => {
        this.setState({loadoutOpen: true})
    }
    private readonly handleCloseLoadout = () => {
        this.setState({loadoutOpen: false})
    }
}
