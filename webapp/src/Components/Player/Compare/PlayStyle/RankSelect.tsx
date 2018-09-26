import {
    createStyles,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"

const ranks = ["Unranked", "Bronze I", "Bronze II", "Bronze III", "Silver I", "Silver II", "Silver III", "Gold I",
    "Gold II", "Gold III", "Platinum I", "Platinum II", "Platinum III", "Diamond I", "Diamond II",
    "Diamond III", "Champion I", "Champion II", "Champion III", "Grand Champion"]

interface OwnProps {
    selectedRank: number
    handleChange: React.ChangeEventHandler<HTMLSelectElement>
}

type Props = OwnProps
    & WithStyles<typeof styles>

class RankSelectComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, selectedRank, handleChange} = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>Rank to compare</InputLabel>
                <Select
                    value={selectedRank}
                    onChange={handleChange}
                    autoWidth
                >
                    <MenuItem value={-1} key="None">
                        Default
                    </MenuItem>
                    {ranks.map((rank, i) => (
                            <MenuItem value={i} key={i}>
                                {rank}
                            </MenuItem>
                        )
                    )}
                </Select>
                <FormHelperText>Select the rank to plot as average</FormHelperText>
            </FormControl>
        )
    }
}

const styles = createStyles({
    formControl: {
        minWidth: 300
    }
})

export const RankSelect = withStyles(styles)(RankSelectComponent)
