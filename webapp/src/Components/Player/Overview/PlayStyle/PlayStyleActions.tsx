import {
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Switch,
    Tooltip
} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import Edit from "@material-ui/icons/Edit"
import Help from "@material-ui/icons/Help"
import * as React from "react"
import { Link } from "react-router-dom"
import { EXPLANATIONS_LINK, PLAYER_COMPARE_WITH_LINK } from "../../../../Globals"
import { LinkButton } from "../../../Shared/LinkButton"
import { PlaylistSelect } from "../../../Shared/Selects/PlaylistSelect"
import { PlayStyleEdit } from "./PlayStyleEdit"

interface OwnProps {
    player: Player
    useFullSizeCompareButton?: boolean
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
    handleChartChange?: () => void
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

        const editSpiderCharts = (
            <IconButton onClick={this.handleOpen}>
                <Edit/>
            </IconButton>
        )
        const whatAreTheseStats = (
            <Link to={EXPLANATIONS_LINK}>
                <IconButton>
                    <Help/>
                </IconButton>
            </Link>
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
                    {whatAreTheseStats}
                </Grid>
                {/*<Grid item xs="auto" style={{margin: "auto"}}>*/}
                {/*<Button variant="outlined"*/}
                {/*onClick={this.handleOpen}*/}
                {/*style={{marginRight: 8, height: "100%"}}*/}
                {/*>*/}
                {/*What are these stats?*/}
                {/*</Button>*/}
                {/*</Grid>*/}
                <Grid item xs="auto" style={{margin: "auto"}}>
                    {editSpiderCharts}
                </Grid>

                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Edit charts</DialogTitle>
                    <DialogContent>
                        <PlayStyleEdit onUpdate={this.onChartUpdate}/>
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

    private readonly onChartUpdate = () => {
        this.handleClose()
        if (this.props.handleChartChange) {
            this.props.handleChartChange()
        }
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
