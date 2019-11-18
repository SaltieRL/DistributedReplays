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

const ranks = [
    "Unranked",
    "Bronze I",
    "Bronze II",
    "Bronze III",
    "Silver I",
    "Silver II",
    "Silver III",
    "Gold I",
    "Gold II",
    "Gold III",
    "Platinum I",
    "Platinum II",
    "Platinum III",
    "Diamond I",
    "Diamond II",
    "Diamond III",
    "Champion I",
    "Champion II",
    "Champion III",
    "Grand Champion"
]

const styles = createStyles({
    formControl: {
        maxWidth: 400,
        minWidth: 200,
        width: "80%"
    }
})

interface OwnProps {
    selectedRank: number
    handleChange: React.ChangeEventHandler<HTMLSelectElement>
    helperText: string
    inputLabel: string
    noneLabel: string
    disabled?: boolean
}

type Props = OwnProps & WithStyles<typeof styles>

class RankSelectComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, selectedRank, handleChange, inputLabel, helperText, noneLabel, disabled} = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>{inputLabel}</InputLabel>
                <Select
                    value={selectedRank}
                    onChange={handleChange as React.ChangeEventHandler<{value: unknown}>}
                    autoWidth
                    disabled={disabled}
                >
                    <MenuItem value={-1} key="None">
                        {noneLabel}
                    </MenuItem>
                    {ranks.map((rank, i) => (
                        <MenuItem value={i} key={i}>
                            {rank}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        )
    }
}

export const RankSelect = withStyles(styles)(RankSelectComponent)
