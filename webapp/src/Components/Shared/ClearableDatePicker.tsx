import { DatePicker, DatePickerProps } from "@material-ui/pickers"
import * as React from "react"

type Props = DatePickerProps

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
