import { Tooltip, WithTheme, withTheme } from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import LightLogoImage from "./calculated-logo-light.png"
import LogoImage from "./calculated-logo.png"

interface OwnProps {
    imgStyle?: React.CSSProperties
}

type Props = OwnProps & WithTheme

class LogoComponent extends React.PureComponent<Props> {
    public render() {
        const logoImage = this.props.theme.palette.type === "dark" ? LightLogoImage : LogoImage
        return (
            <Link to="/">
                <Tooltip title={"calculated.gg is 1 year old!"}>
                    <img alt="calculated.gg logo" src={logoImage} style={this.props.imgStyle}/>
                </Tooltip>
            </Link>
        )
    }
}

export const Logo = withTheme()(LogoComponent)
