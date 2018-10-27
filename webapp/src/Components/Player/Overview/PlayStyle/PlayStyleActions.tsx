import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton, Switch,
    Tooltip
} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import * as React from "react"
import { Link } from "react-router-dom"
import { PLAYER_COMPARE_WITH_LINK } from "../../../../Globals"
import { LinkButton } from "../../../Shared/LinkButton"
import { PlaylistSelect } from "../../../Shared/Selects/PlaylistSelect"
import { PlayStyleExplanationTable } from "./PlayStyleExplanationTable"

interface OwnProps {
    player: Player
    useFullSizeCompareButton?: boolean
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
}

type Props = OwnProps

interface State {
    dialogOpen: boolean
    playlist: number
    winLossMode: boolean
}

export class PlayStyleActions extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {dialogOpen: false, playlist: 13, winLossMode: false}
    }

    public render() {
        const compareButton = this.props.useFullSizeCompareButton ? (
            <LinkButton icon={CompareArrows} iconType="mui"
                        to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                Compare
            </LinkButton>
        ) : (
            <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                <Tooltip title="Compare with...">
                    <IconButton style={{marginRight: 8, top: -3}}>
                        <CompareArrows/>
                    </IconButton>
                </Tooltip>
            </Link>
        )
        const dropDown = (
            <PlaylistSelect
                selectedPlaylist={this.state.playlist}
                handleChange={this.handlePlaylistsChange}
                inputLabel="Playlist"
                helperText="Select playlist to use"
                dropdownOnly
                currentPlaylistsOnly
                multiple={false}/>
        )

        const toggleWinsLosses = (
            <FormControlLabel
                control={<Switch onChange={this.handleWinsLossesChange}/>}
                label="Wins/Losses mode"
            />
        )

        return (
            <Grid container justify="center" spacing={8}>
                <Grid item xs="auto" style={{margin: "auto"}}>
                    {toggleWinsLosses}
                </Grid>
                <Grid item xs="auto" style={{margin: "auto"}}>
                    {dropDown}
                </Grid>
                <Grid item xs="auto" style={{margin: "auto"}}>
                    {compareButton}
                </Grid>
                <Grid item xs="auto" style={{margin: "auto"}}>
                    <Button variant="outlined"
                            onClick={this.handleOpen}
                            style={{marginRight: 8, height: "100%"}}
                    >
                        What are these stats?
                    </Button>
                </Grid>

                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Explanation of terms</DialogTitle>
                    <DialogContent>
                        <PlayStyleExplanationTable/>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }

    private readonly handleOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleClose = () => {
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
