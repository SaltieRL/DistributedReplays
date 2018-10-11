import {DatePicker} from "material-ui-pickers"
import {DatePickerModalProps} from "material-ui-pickers/DatePicker/DatePickerModal"
import * as React from "react"

type Props = DatePickerModalProps

export class ClearableDatePicker extends React.PureComponent<Props> {
    public render() {
        return (
            <DatePicker
                {...this.props}
                format="DD/MM/YYYY"
                clearable/>
        )
    }
}
