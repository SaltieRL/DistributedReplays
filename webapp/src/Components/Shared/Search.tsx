import {faCalculator, faSearch} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton, Paper, TextField} from "@material-ui/core"
import * as React from "react"


interface Props {
    usePaper: boolean
    useCalculatorIcon?: boolean
}

interface State {
    enteredText: string
}


export class Search extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            enteredText: ""
        }
    }

    public render() {
        const searchButton =
            <IconButton aria-label="Search" onClick={this.onSubmit}>
                <FontAwesomeIcon icon={this.props.useCalculatorIcon ? faCalculator : faSearch}/>
            </IconButton>

        const inputField =
            <>
                <form onSubmit={this.onSubmit} style={{margin: "auto 16px", width: "100%"}}>
                    <TextField
                        name="name"
                        type="text"
                        placeholder="Enter a steamId or username"
                        onChange={this.handleChange}
                        value={this.state.enteredText}
                        fullWidth
                        InputProps={{disableUnderline: this.props.usePaper, endAdornment: searchButton}}
                        required
                    />
                </form>
                {/*{searchButton}*/}
            </>

        const containerStyle: React.CSSProperties = {
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "500px",
            width: "100%"
        }

        return (
            <>
                {this.props.usePaper ?
                    <Paper style={containerStyle}>
                        {inputField}
                    </Paper>
                    :
                    <div style={containerStyle}>
                        {inputField}
                    </div>
                }
            </>
        )
    }

    private readonly handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({enteredText: e.target.value})
    }

    private readonly onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        // TODO: Make call
        console.log(this.state.enteredText)
        return
    }
}
