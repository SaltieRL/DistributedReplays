import * as React from "react"
import LogoImage from "./calculated-logo.png"

interface Props {
    imgStyle?: React.CSSProperties
}

export class Logo extends React.PureComponent<Props> {
    public render() {
        return (
            <img src={LogoImage} style={this.props.imgStyle}/>
        )
    }
}
