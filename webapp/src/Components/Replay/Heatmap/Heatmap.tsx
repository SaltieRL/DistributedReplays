import { WithTheme, withTheme } from "@material-ui/core"
import h337 from "heatmap.js"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"

interface OwnProps {
    style: any
    data: any
    config: any
}

type Props = OwnProps & WithTheme

interface State {
    cfg: any
    heatmapInstance: any
}

class ReactHeatmapComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {cfg: null, heatmapInstance: null}
    }

    public componentDidMount() {
        const {style, data, config} = this.props
        const c = config || {}
        const container = ReactDOM.findDOMNode(this)
        if (container !== null) {
            const defaultCfg = {
                width: style.width,
                height: style.height,
                // >>> {str(i/20 + 0.5): matplotlib.colors.to_hex(cmap(i/10)) for i in range(0, 12, 2)}
                // {'0.5': '#440154', '1.0': '#fde725', '0.7': '#2a788e',
                // '0.9': '#7ad151', '0.6': '#414487', '0.8': '#22a884'}
                gradient: {
                    "0.0": "#fff",
                    "0.5": "#440154",
                    "0.6": "#414487",
                    "0.7": "#2a788e",
                    "0.8": "#22a884",
                    "0.9": "#7ad151",
                    "1.0": "#fde725"
                }
            }

            const localCfg = _.merge(defaultCfg, c)
            localCfg.container = container
            const heatmapInstance = h337.create(localCfg)
            heatmapInstance.setData(data)
            this.setState({cfg: localCfg, heatmapInstance})
        }
    }

    public render() {
        return (
            // tslint:disable-next-line
            <div ref="react-heatmap"/>
        )
    }
}

export const ReactHeatmap = withTheme()(ReactHeatmapComponent)
