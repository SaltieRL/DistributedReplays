import * as react from "react"
import { getQueueLength } from "../../../Requests/Global";
import {QueueLengths} from "../../../Models/QueueLengths"

export class queueLengthComponent extends react.PureComponent<Props, State> {

    constructor(props) {
        super(props);
        this.state = {queueLengths: QueueLengths}
      }

    public componentDidMount() {
        getQueueLength()
            .then((queueLength) => this.setState({queueLength})) //is this needed initially?
        this.timerID = setInterval(
            () => this.getLength(),
            10000
        );
    }

    public componentWillUnmount() {
        clearInterval(this.timerID);
    }

    public render() {
        return (
                <Typography>
                    <i>{this.state.queueLengths.queueLength} replays in queue 0...</i>
                </Typography>
        )
    }

    private readonly getLength = (): Promise<void> => {
        return getQueueLength()
            .then((queueLength) => this.setState({queueLength}))
    }
}