import * as React from "react"
import LogoImage from "./calculated-logo.png"

export class Logo extends React.PureComponent {
    public render() {
        return (
            <img src={LogoImage} style={{maxWidth: "80vw"}}/>
        )
    }
}
