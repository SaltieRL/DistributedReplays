import * as React from "react"
import { Link } from "react-router-dom"

interface Props {
    imgStyle?: React.CSSProperties
}

export class Logo extends React.PureComponent<Props> {
    public render() {
        return (
            <Link to="/">
                <img src="/assets/shared/calculated-logo.png" style={this.props.imgStyle}/>
            </Link>
        )
    }
}
