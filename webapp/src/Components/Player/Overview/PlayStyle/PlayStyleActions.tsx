import {
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Switch
} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import Info from "@material-ui/icons/Info"
import MoreVert from "@material-ui/icons/MoreVert"
import * as React from "react"
import { PlaylistSelect } from "../../../Shared/Selects/PlaylistSelect"
import { PlayStyleExplanationTable } from "./PlayStyleExplanationTable"

interface OwnProps {
    player: Player
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
}

type Props = OwnProps

interface MenuState {
    menuOpen: boolean
    anchorElement?: HTMLElement
}

interface ActionsState {
    dialogOpen: boolean
    playlist: number
    winLossMode: boolean
}

type State = MenuState & ActionsState

export class PlayStyleActions extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            menuOpen: false,
            dialogOpen: false,
            playlist: 13,
            winLossMode: false
        }
    }

    public render() {
        const playlistSelect = (
            <PlaylistSelect
                selectedPlaylist={this.state.playlist}
                handleChange={this.handlePlaylistsChange}
                inputLabel=""
                helperText=""
                dropdownOnly
                currentPlaylistsOnly
                multiple={false}
            />
        )

        const toggleWinsLosses = (
            <FormControlLabel
                control={<Switch onChange={this.handleWinsLossesChange}/>}
                label="Wins/Losses mode"
            />
        )

        const explanationsDialog = (
            <Dialog open={this.state.dialogOpen}
                    onClose={this.handleExplanationsClose}
                    scroll="paper"
            >
                <DialogTitle>Explanation of terms</DialogTitle>
                <DialogContent>
                    <PlayStyleExplanationTable/>
                </DialogContent>
            </Dialog>
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
                        <MenuItem onClick={this.handleExplanationsOpen}>
                            <ListItemIcon><Info/></ListItemIcon>
                            <ListItemText primary="Stats explanations"/>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><CompareArrows/></ListItemIcon>
                            <ListItemText primary="Compare with other players"/>
                        </MenuItem>
                        <MenuItem style={{justifyContent: "center"}}>
                            {playlistSelect}
                        </MenuItem>
                        <MenuItem>
                            {toggleWinsLosses}
                        </MenuItem>
                    </Menu>
                </>

                {explanationsDialog}
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

    private readonly handleExplanationsOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleExplanationsClose = () => {
        this.setState({dialogOpen: false})
    }

    private readonly handlePlaylistsChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedPlaylist = event.target.value as any as number
        this.setState({playlist: selectedPlaylist})
        if (this.props.handlePlaylistChange) {
            this.props.handlePlaylistChange(selectedPlaylist)
        }
    }

    private readonly handleWinsLossesChange = (event: React.ChangeEvent<HTMLInputElement>, winLossMode: boolean) => {
        this.setState({winLossMode})
        if (this.props.handleWinsLossesChange) {
            this.props.handleWinsLossesChange(winLossMode)
        }
    }
}
