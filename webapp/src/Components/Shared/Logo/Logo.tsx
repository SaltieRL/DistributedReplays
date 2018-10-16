import * as React from "react"
import { Link } from "react-router-dom"
import LogoImage from "./calculated-logo.png"

interface Props {
    imgStyle?: React.CSSProperties
}

export class Logo extends React.PureComponent<Props> {
    public render() {
        return (
            <Link to="/">
                <img src={LogoImage} style={this.props.imgStyle} />
            </Link>
        )
    }
}
