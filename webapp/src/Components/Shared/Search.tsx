import {faCalculator} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton, Paper, TextField} from "@material-ui/core"
import * as React from "react"


interface State {
    enteredText: string
}


export class Search extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            enteredText: ""
        }
    }


    public render() {
        return (
            <Paper style={{display: "flex", justifyContent: "space-between", maxWidth: "500px", width: "100%"}}>
                <form onSubmit={this.onSubmit} style={{margin: "auto 16px", width: "100%"}}>
                    <TextField
                        name="name"
                        type="text"
                        placeholder="Enter a steamId or username"
                        onChange={this.handleChange}
                        value={this.state.enteredText}
                        fullWidth
                        InputProps={{disableUnderline: true}}
                        required
                    />
                </form>
                <IconButton aria-label="Search" onClick={this.onSubmit}>
                    <FontAwesomeIcon icon={faCalculator}/>
                </IconButton>
            </Paper>
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
