import h337 from "heatmap.js"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"

interface Props {
    style: any
    data: any
    config: any
}

interface State {
    cfg: any
    heatmapInstance: any
}

export class ReactHeatmap extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context)
        this.state = {cfg: null, heatmapInstance: null}
    }

    public componentDidMount() {
        const {style, data, config} = this.props
        const c = config || {}
        const container = ReactDOM.findDOMNode(this)
        if (container !== null) {
            const defaultCfg = {
                width: style.width.replace("px", ""),
                height: style.height.replace("px", "")
            }
            const localCfg = _.merge(defaultCfg, c)
            localCfg.container = container
            const heatmapInstance = h337.create(localCfg)
            console.log("data", data)
            heatmapInstance.setData(data)
            this.setState({cfg: localCfg, heatmapInstance})
        } else {
            console.log("null")
        }
    }

    // public componentWillReceiveProps(nextProps: Props) {
    //     return nextProps !== this.props
    // }

    public render() {

        return (
            <>
                <div ref={"react-heatmap"}/>
            </>
        )

    }

}
