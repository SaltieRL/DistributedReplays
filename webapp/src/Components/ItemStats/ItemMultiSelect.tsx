import { Avatar, ListItemAvatar, withStyles, WithStyles } from "@material-ui/core"
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import { createStyles } from "@material-ui/core/styles"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import Downshift from "downshift"
import deburr from "lodash/deburr"
import * as React from "react"
import { Item, ItemListResponse } from "../../Models/ItemStats"
import { getItems } from "../../Requests/Global"

type RenderInputProps = TextFieldProps & WithStyles<typeof styles> & {
    ref?: React.Ref<HTMLDivElement>;
}

const renderInput = (inputProps: RenderInputProps) => {
    const {InputProps, classes, ref, ...other} = inputProps

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput
                },
                ...InputProps
            }}
            {...other}
        />
    )
}

interface RenderSuggestionProps {
    highlightedIndex: number | null
    index: number
    itemProps: any
    selectedItem: Item["ingameid"]
    suggestion: Item
}

const renderSuggestion = (suggestionProps: RenderSuggestionProps) => {
    const {suggestion, index, itemProps, highlightedIndex} = suggestionProps
    const isHighlighted = highlightedIndex === index
    // const isSelected = (selectedItem.name || "").indexOf(suggestion) > -1

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.ingameid}
            selected={isHighlighted}
            component="div"
        >

            <ListItemAvatar>
                <Avatar alt={suggestion.name} src={suggestion.image}/>
            </ListItemAvatar>
            {suggestion.name}
        </MenuItem>
    )
}

const getSuggestions = (suggestions: Item[], value: string, {showEmpty = false} = {}) => {
    const inputValue = deburr(value.trim()).toLowerCase()
    const inputLength = inputValue.length
    let count = 0
    return inputLength === 0 && !showEmpty
        ? []
        : suggestions.filter((suggestion) => {
            const keep = count < 5 && (suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1)
            if (keep) {
                count += 1
            }
            return keep
        })
}

interface MultipleSelectOwnProps {
    items: Item[]
    selectedItem: Item[]
    setSelectedItem: (item: Item[]) => void
}

type MultipleSelectProps = MultipleSelectOwnProps
    & WithStyles<typeof styles>

const DownshiftMultiple = (props: MultipleSelectProps) => {
    const {classes, items, selectedItem, setSelectedItem} = props
    const [inputValue, setInputValue] = React.useState("")
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (selectedItem.length && !inputValue.length && event.key === "Backspace") {
            setSelectedItem(selectedItem.slice(0, selectedItem.length - 1))
        }
    }

    const handleInputChange = (event: React.ChangeEvent<{ value: string }>) => {
        setInputValue(event.target.value)
    }

    const handleChange = (item: Item) => {
        let newSelectedItem = [...selectedItem]
        if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item]
        }
        setInputValue("")
        setSelectedItem(newSelectedItem)
    }

    const handleDelete = (item: Item) => () => {
        const newSelectedItem = [...selectedItem]
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1)
        setSelectedItem(newSelectedItem)
    }

    return (
        <Downshift
            id="downshift-multiple"
            inputValue={inputValue}
            onChange={handleChange}
            selectedItem={selectedItem}
        >
            {({
                  getInputProps,
                  getItemProps,
                  getLabelProps,
                  isOpen,
                  inputValue: inputValue2,
                  selectedItem: selectedItem2,
                  highlightedIndex
              }) => {
                const {onBlur, onChange, onFocus, ...inputProps} = getInputProps({
                    onKeyDown: handleKeyDown,
                    placeholder: "Type an item name"
                })
                return (
                    <div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            label: "Compare items",
                            InputLabelProps: getLabelProps(),
                            InputProps: {
                                startAdornment: selectedItem.map((item) => (
                                    <Chip
                                        avatar={<Avatar alt={item.name} src={item.image}/>}
                                        key={item.ingameid}
                                        tabIndex={-1}
                                        label={item.name}
                                        className={classes.chip}
                                        onDelete={handleDelete(item)}
                                    />
                                )),
                                onBlur,
                                onChange: (event) => {
                                    handleInputChange(event)
                                    onChange!(event as React.ChangeEvent<HTMLInputElement>)
                                },
                                onFocus
                            },
                            inputProps
                        })}
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                                {getSuggestions(items, inputValue2!).map((suggestion: any, index: number) =>
                                    renderSuggestion({
                                        suggestion,
                                        index,
                                        itemProps: getItemProps({item: suggestion}),
                                        highlightedIndex,
                                        selectedItem: selectedItem2
                                    })
                                )}
                            </Paper>
                        ) : null}
                    </div>
                )
            }}
        </Downshift>
    )
}

interface OwnProps {
    setSelectedItem: (item: Item[]) => void
    selected: Item[]
}

interface State {
    items?: Item[]
}

type Props = OwnProps
    & WithStyles

class ItemMultiSelectComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {items: undefined}
    }

    public componentDidMount(): void {
        this.getItemList()
    }

    public render() {
        const {classes} = this.props
        const {items} = this.state
        return (
            <>
                {items &&
                <DownshiftMultiple setSelectedItem={this.props.setSelectedItem}
                                   selectedItem={this.props.selected}
                                   items={items}
                                   classes={classes}/>}
            </>
        )
    }

    private readonly getItemList = () => {
        return getItems(0, 10000, undefined).then((data: ItemListResponse) => {
            this.setState({items: data.items})
        })
    }
}

const styles = createStyles({
    root: {
        flexGrow: 1,
        height: 250
    },
    container: {
        flexGrow: 1,
        position: "relative"
    },
    paper: {
        position: "absolute",
        zIndex: 1,
        left: 0,
        right: 0
    },
    chip: {},
    inputRoot: {
        flexWrap: "wrap"
    },
    inputInput: {
        width: "auto",
        flexGrow: 1
    }
})

export const ItemMultiSelect = withStyles(styles)(ItemMultiSelectComponent)
