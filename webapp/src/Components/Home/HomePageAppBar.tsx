import { faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AppBar, IconButton, Toolbar, Tooltip } from "@material-ui/core"
import Menu from "@material-ui/icons/Menu"
import * as React from "react"
import { ThemeContext } from "../../Theme"

interface Props {
    toggleSideBar: () => void
}

export class HomePageAppBar extends React.PureComponent<Props> {
    public render() {
        return (
            <AppBar color="default">
                <Toolbar>
                    <IconButton onClick={this.props.toggleSideBar} style={{marginLeft: -12}}>
                        <Menu/>
                    </IconButton>
                    <span style={{flexGrow: 1}}/>
                    <ThemeContext.Consumer>
                        {(themeValue) => (
                            <Tooltip title="Toggle theme">
                                <IconButton onClick={themeValue.toggleTheme}>
                                    <FontAwesomeIcon icon={faLightbulb} style={{width: 24, height: 24}}/>
                                </IconButton>
                            </Tooltip>
                        )}
                    </ThemeContext.Consumer>
                </Toolbar>
            </AppBar>
        )
    }
}
