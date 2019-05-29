import {
    Checkbox,
    createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
    FormControl, FormControlLabel,
    FormHelperText, IconButton, Input,
    InputLabel,
    MenuItem,
    Select, Tooltip,
    WithStyles,
    withStyles
} from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import ExpandMore from "@material-ui/icons/ExpandMore"
import * as _ from "lodash"
import * as React from "react"
import { PlaylistMetadata, playlists } from "../../../Utils/Playlists"

interface OwnProps {
    helperText: string
    inputLabel: string
    dropdownOnly?: boolean
    currentPlaylistsOnly?: boolean
}

interface MultiplePlaylistProps {
    multiple: true
    selectedPlaylists: number[]
    handleChange: React.ChangeEventHandler<HTMLSelectElement>
}

interface SinglePlaylistProps {
    multiple: false
    selectedPlaylist: number
    handleChange: React.ChangeEventHandler<HTMLSelectElement>
}

const styles = createStyles({
    formControl: {
        maxWidth: 400,
        minWidth: 200,
        width: "90%"
    },
    panelDetails: {
        flexWrap: "wrap"
    },
    root: {
        cursor: "default"
    },
    content: {
        cursor: "default"
    }
})

type Props = (SinglePlaylistProps | MultiplePlaylistProps) & OwnProps
    & WithStyles<typeof styles>

interface State {
    filterCurrent: boolean
    filterRanked: boolean
    filterStandardMode: boolean
    filterPublic: boolean // Just playlists that exist on play online menu, in which we can get consistent data
    optionsExpanded: boolean
}

class PlaylistSelectComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            filterCurrent: true,
            filterRanked: false,
            filterStandardMode: false,
            filterPublic: Boolean(props.currentPlaylistsOnly),
            optionsExpanded: false
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if ((this.state.filterRanked !== prevState.filterRanked)
            || (this.state.filterStandardMode !== prevState.filterStandardMode)
            || (this.state.filterCurrent !== prevState.filterCurrent)) {
            const filteredPlaylists = this.getFilteredPlaylists().map((playlist) => playlist.value)
            const selectedPlaylists = this.props.multiple ? this.props.selectedPlaylists : [this.props.selectedPlaylist]
            const filteredSelectedPlaylists = _.intersection(selectedPlaylists, filteredPlaylists)
            if (!_.isEqual(selectedPlaylists, filteredSelectedPlaylists)) {
                this.setSelectedPlaylists(filteredSelectedPlaylists)
            }
        }
    }

    public render() {
        const {classes, handleChange, inputLabel, helperText} = this.props

        const playlistsMultiSelect = (
            <FormControl className={classes.formControl}>
                <InputLabel>{inputLabel}</InputLabel>
                <Select
                    multiple={this.props.multiple}
                    value={this.props.multiple ? this.props.selectedPlaylists : this.props.selectedPlaylist}
                    onChange={handleChange}
                    autoWidth
                    input={
                        <Input
                            endAdornment={
                                this.props.multiple && this.props.selectedPlaylists.length > 0 &&
                                <IconButton onClick={this.clearSelection}>
                                    <Tooltip title="Clear selection">
                                        <Clear/>
                                    </Tooltip>
                                </IconButton>
                            }
                        />
                    }
                >
                    {this.getFilteredPlaylists()
                        .map((playlist) => (
                                <MenuItem value={playlist.value} key={playlist.value}>
                                    {playlist.name}
                                </MenuItem>
                            )
                        )
                    }
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        )

        const filterCurrentCheckbox = (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterCurrent}
                        onChange={this.handleCheckboxChange("filterCurrent")}
                    />
                }
                label="Show only current playlists"
            />
        )
        const filterStandardCheckbox = (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterStandardMode}
                        onChange={this.handleCheckboxChange("filterStandardMode")}
                    />
                }
                label="Show only standard modes"
            />
        )
        const filterRankedCheckbox = (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterRanked}
                        onChange={this.handleCheckboxChange("filterRanked")}
                    />
                }
                label="Show only ranked playlists"
            />
        )

        return (
            <>
                {!this.props.dropdownOnly &&
                <ExpansionPanel square={false} expanded={this.state.optionsExpanded}>
                    <ExpansionPanelSummary
                        classes={{root: classes.root, content: classes.content}}
                        expandIcon={
                            <Tooltip title="Playlist options">
                                <ExpandMore/>
                            </Tooltip>
                        }
                        IconButtonProps={{onClick: this.handleExpandedChange}}
                    >
                        {playlistsMultiSelect}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        {filterCurrentCheckbox}
                        {filterStandardCheckbox}
                        {filterRankedCheckbox}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                }
                {this.props.dropdownOnly && playlistsMultiSelect}
            </>
        )
    }

    private readonly getFilteredPlaylists = (): PlaylistMetadata[] => {
        const {filterCurrent, filterRanked, filterStandardMode, filterPublic} = this.state
        return playlists
            .filter((playlistMetadata) => !filterCurrent || playlistMetadata.current)
            .filter((playlistMetadata) => !filterRanked || playlistMetadata.ranked)
            .filter((playlistMetadata) => !filterStandardMode || playlistMetadata.standardMode)
            .filter((playlistMetadata) => !filterPublic || playlistMetadata.publicMode)
    }

    private readonly handleCheckboxChange = (filterField: keyof State) =>
        (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            this.setState({[filterField]: checked} as Pick<State, keyof State>)
        }

    private readonly clearSelection = () => {
        this.setSelectedPlaylists([])
    }

    private readonly setSelectedPlaylists = (playlistsToSet: number[]) => {
        this.props.handleChange({target: {value: playlistsToSet}} as any as React.ChangeEvent<HTMLSelectElement>)
    }

    private readonly handleExpandedChange = () => {
        this.setState({optionsExpanded: !this.state.optionsExpanded})
    }
}

export const PlaylistSelect = withStyles(styles)(PlaylistSelectComponent)
