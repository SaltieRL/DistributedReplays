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

interface PlaylistMetadata {
    name: string
    value: number
    current: boolean
    ranked: boolean
    standardMode: boolean
}

const playlists: PlaylistMetadata[] = [
    {
        name: "Duels (U)",
        value: 1,
        current: true,
        ranked: false,
        standardMode: true
    },
    {
        name: "Doubles (U)",
        value: 2,
        current: true,
        ranked: false,
        standardMode: true
    },
    {
        name: "Standard (U)",
        value: 3,
        current: true,
        ranked: false,
        standardMode: true
    },
    {
        name: "Chaos (U)",
        value: 4,
        current: true,
        ranked: false,
        standardMode: true
    },
    {
        name: "Custom",
        value: 6,
        current: true,
        ranked: false,
        standardMode: false
    },
    {
        name: "Offline",
        value: 8,
        current: true,
        ranked: false,
        standardMode: false
    },
    {
        name: "Duels",
        value: 10,
        current: true,
        ranked: true,
        standardMode: true
    },
    {
        name: "Doubles",
        value: 11,
        current: true,
        ranked: true,
        standardMode: true
    },
    {
        name: "Solo Standard",
        value: 12,
        current: true,
        ranked: true,
        standardMode: true
    },
    {
        name: "Standard",
        value: 13,
        current: true,
        ranked: true,
        standardMode: true
    },
    {
        name: "Snow Day (U)",
        value: 15,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Rocket Labs",
        value: 16,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Hoops (U)",
        value: 17,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Rumble (U)",
        value: 18,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Dropshot (U)",
        value: 23,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Anniversary",
        value: 25,
        current: false,
        ranked: false,
        standardMode: false
    },
    {
        name: "Hoops",
        value: 27,
        current: true,
        ranked: true,
        standardMode: false
    },
    {
        name: "Rumble",
        value: 28,
        current: true,
        ranked: true,
        standardMode: false
    },
    {
        name: "Dropshot",
        value: 29,
        current: true,
        ranked: true,
        standardMode: false
    },
    {
        name: "Snow Day",
        value: 30,
        current: true,
        ranked: true,
        standardMode: false
    }
]

interface OwnProps {
    selectedPlaylists: number[]
    handleChange: React.ChangeEventHandler<HTMLSelectElement>
    helperText: string
    inputLabel: string
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    filterCurrent: boolean
    filterRanked: boolean
    filterStandardMode: boolean
    optionsExpanded: boolean
}

class PlaylistSelectComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            filterCurrent: true,
            filterRanked: false,
            filterStandardMode: false,
            optionsExpanded: false
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if ((this.state.filterRanked !== prevState.filterRanked)
            || (this.state.filterStandardMode !== prevState.filterStandardMode)
            || (this.state.filterCurrent !== prevState.filterCurrent)) {
            const filteredPlaylists = this.getFilteredPlaylists().map((playlist) => playlist.value)
            const filteredSelectedPlaylists = _.intersection(this.props.selectedPlaylists, filteredPlaylists)
            if (!_.isEqual(this.props.selectedPlaylists, filteredSelectedPlaylists)) {
                this.setSelectedPlaylists(filteredSelectedPlaylists)
            }
        }
    }

    public render() {
        const {classes, selectedPlaylists, handleChange, inputLabel, helperText} = this.props

        const playlistsMultiSelect =
            <FormControl className={classes.formControl}>
                <InputLabel>{inputLabel}</InputLabel>
                <Select
                    multiple
                    value={selectedPlaylists}
                    onChange={handleChange}
                    autoWidth
                    input={
                        <Input
                            endAdornment={
                                selectedPlaylists.length > 0 &&
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

        const filterCurrentCheckbox =
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterCurrent}
                        onChange={this.handleCheckboxChange("filterCurrent")}
                    />
                }
                label="Show only current playlists"
            />
        const filterStandardCheckbox =
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterStandardMode}
                        onChange={this.handleCheckboxChange("filterStandardMode")}
                    />
                }
                label="Show only standard modes"
            />
        const filterRankedCheckbox =
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.state.filterRanked}
                        onChange={this.handleCheckboxChange("filterRanked")}
                    />
                }
                label="Show only ranked playlists"
            />

        return (
            <ExpansionPanel square={false} expanded={this.state.optionsExpanded}>
                <ExpansionPanelSummary expandIcon={
                    <IconButton onClick={this.handleExpandedChange}>
                        <Tooltip title="Playlist options">
                            <ExpandMore/>
                        </Tooltip>
                    </IconButton>
                }>
                    {playlistsMultiSelect}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    {filterCurrentCheckbox}
                    {filterStandardCheckbox}
                    {filterRankedCheckbox}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    private readonly getFilteredPlaylists = (): PlaylistMetadata[] => {
        const {filterCurrent, filterRanked, filterStandardMode} = this.state
        return playlists
            .filter((playlistMetadata) => !filterCurrent || playlistMetadata.current)
            .filter((playlistMetadata) => !filterRanked || playlistMetadata.ranked)
            .filter((playlistMetadata) => !filterStandardMode || playlistMetadata.standardMode)
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

const styles = createStyles({
    formControl: {
        maxWidth: 400,
        minWidth: 200,
        width: "90%"
    },
    panelDetails: {
        flexWrap: "wrap"
    }
})

export const PlaylistSelect = withStyles(styles)(PlaylistSelectComponent)
