import {
    Chip,
    createStyles,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import { convertSnakeAndCamelCaseToReadable } from "../../../../Utils/String"

interface OwnProps {
    fields: string[]
    selectedFields: string[]
    handleChange: React.ChangeEventHandler
}

type Props = OwnProps
    & WithStyles<typeof styles>

class FieldSelectComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, fields, selectedFields, handleChange} = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>Fields</InputLabel>
                <Select
                    multiple
                    value={selectedFields}
                    onChange={handleChange}
                    autoWidth
                    renderValue={(selectedFieldsToRender: any) => {
                        return (
                            <div className={classes.chipWrapper}>
                                {selectedFieldsToRender.map((field: string) => (
                                    <Chip key={field} label={convertSnakeAndCamelCaseToReadable(field)}
                                          onDelete={this.handleChipDelete(field)}
                                          className={classes.chip}
                                    />
                                ))}
                            </div>
                        )
                    }}
                >
                    {fields.map((field) => (
                            <MenuItem value={field} key={field}>
                                {convertSnakeAndCamelCaseToReadable(field)}
                            </MenuItem>
                        )
                    )}
                </Select>
                <FormHelperText>Select fields to plot</FormHelperText>
            </FormControl>
        )
    }

    private readonly handleChipDelete = (field: string) => () => {
        this.props.handleChange({
            target: {
                value: this.props.selectedFields.filter((selectedField) => selectedField !== field)
            }
        } as any as React.ChangeEvent)
    }
}

const styles = (theme: Theme) => createStyles({
    formControl: {
        minWidth: 250,
        width: "90%"
    },
    chipWrapper: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: theme.spacing.unit / 4
    }
})

export const FieldSelect = withStyles(styles)(FieldSelectComponent)
