import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Switch
} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import Edit from "@material-ui/icons/Edit"
import MoreVert from "@material-ui/icons/MoreVert"
import * as React from "react"
import { Link } from "react-router-dom"
import { PLAYER_COMPARE_WITH_LINK } from "../../../../Globals"
import { PlaylistSelect } from "../../../Shared/Selects/PlaylistSelect"
import { PlayStyleEdit } from "./PlayStyleEdit"
import { Help } from "@material-ui/icons"

interface OwnProps {
    player: Player
    playlist: number
    winLossMode: boolean
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
    handleChartChange?: () => void
}

type Props = OwnProps

interface MenuState {
    menuOpen: boolean
    anchorElement?: HTMLElement
}

interface ActionsState {
    dialogOpen: boolean
}

type State = MenuState & ActionsState

export class PlayStyleActions extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            menuOpen: false,
            dialogOpen: false
        }
    }

    public render() {
        const playlistSelect = (
            <PlaylistSelect
                selectedPlaylist={this.props.playlist}
                handleChange={this.handlePlaylistsChange}
                inputLabel=""
                helperText=""
                dropdownOnly
                currentPlaylistsOnly
                multiple={false}
            />
        )

        const editSpiderCharts = (
            <IconButton onClick={this.handleOpen}>
                <Edit/>
            </IconButton>
        )
        const whatAreTheseStats = (
            <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)} style={{textDecoration: "none"}}>
                <MenuItem>
                    <ListItemIcon><Help/></ListItemIcon>
                    <ListItemText primary="What are these stats?"/>
                </MenuItem>
            </Link>

        )

        return (
            <>
                <>
                    <IconButton onClick={this.handleOpen} style={{marginRight: 8}}>
                        <MoreVert/>
                    </IconButton>
                    <Menu
                        open={this.state.menuOpen}
                        anchorEl={this.state.anchorElement}
                        onClose={this.handleClose}
                    >
                        {whatAreTheseStats}
                        <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)} style={{textDecoration: "none"}}>
                            <MenuItem>
                                <ListItemIcon><CompareArrows/></ListItemIcon>
                                <ListItemText primary="Compare with other players"/>
                            </MenuItem>
                        </Link>
                        <Divider component={"li" as any}/>
                        <MenuItem style={{justifyContent: "center"}}>
                            {playlistSelect}
                        </MenuItem>
                        <MenuItem onClick={this.toggleWinsLossesMode}>
                            <ListItemIcon>
                                <Switch checked={this.props.winLossMode}/>
                            </ListItemIcon>
                            <ListItemText primary="Wins/Losses mode"/>
                        </MenuItem>
                        <MenuItem>
                            {editSpiderCharts}
                        </MenuItem>

                        <Dialog open={this.state.dialogOpen}
                                onClose={this.handleClose}
                                scroll="paper"
                        >
                            <DialogTitle>Edit charts</DialogTitle>
                            <DialogContent>
                                <PlayStyleEdit onUpdate={this.onChartUpdate}/>
                            </DialogContent>
                        </Dialog>
                    </Menu>
                </>
            </>
        )
    }

    private readonly handleOpen: React.MouseEventHandler<HTMLElement> = (event) => {
        this.setState({
            menuOpen: true,
            anchorElement: event.currentTarget
        })
    }

    private readonly handleClose = () => {
        this.setState({
            menuOpen: false,
            anchorElement: undefined
        })
    }

    private readonly onChartUpdate = () => {
        this.handleClose()
        if (this.props.handleChartChange) {
            this.props.handleChartChange()
        }
    }

    private readonly handlePlaylistsChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedPlaylist = event.target.value as any as number
        if (this.props.handlePlaylistChange) {
            this.props.handlePlaylistChange(selectedPlaylist)
        }
    }

    private readonly toggleWinsLossesMode: React.MouseEventHandler = () => {
        if (this.props.handleWinsLossesChange) {
            this.props.handleWinsLossesChange(!this.props.winLossMode)
        }
    }
}
