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
                height: style.height.replace("px", ""),
                // >>> {str(i/20 + 0.5): matplotlib.colors.to_hex(cmap(i/10)) for i in range(0, 12, 2)}
                // {'0.5': '#440154', '1.0': '#fde725', '0.7': '#2a788e',
                // '0.9': '#7ad151', '0.6': '#414487', '0.8': '#22a884'}
                gradient: {
                    "0.5": "#440154",
                    "1.0": "#fde725",
                    "0.7": "#2a788e",
                    "0.9": "#7ad151",
                    "0.6": "#414487",
                    "0.8": "#22a884",
                    "0.0": "#fff"
                },
                backgroundColor: "rgba(68,1,84,0.5)"
            }

            const localCfg = _.merge(defaultCfg, c)
            localCfg.container = container
            const heatmapInstance = h337.create(localCfg)
            heatmapInstance.setData(data)
            this.setState({cfg: localCfg, heatmapInstance})
        }
    }

    // public componentWillReceiveProps(nextProps: Props) {
    //     return nextProps !== this.props
    // }

    public render() {

        return (
            // tslint:disable-next-line
            <div ref="react-heatmap"/>
        )

    }

}
