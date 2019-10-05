import { withWidth } from "@material-ui/core"
import { WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"

interface OwnProps {

}

type Props = OwnProps
    & WithWidth

interface State {
    open: boolean
    anchorElement?: HTMLElement
}

class ResultsActionsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {


        return (
            <></>
        )
    }
}

export const TrainingPackResultsActions = withWidth()(ResultsActionsComponent)
