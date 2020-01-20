import React, {Component, ComponentType} from "react"

import {Typography} from "@material-ui/core"

type Props = any

interface State {
    errorOnDynamicLoad: boolean
    component: ComponentType | null
}

export const codeSplit = (importComponent: () => Promise<any>, importKey: string) => {
    class AsyncComponent extends Component<Props, State> {
        constructor(props: Props) {
            super(props)

            this.state = {
                errorOnDynamicLoad: false,
                component: null
            }
        }

        public async componentDidMount() {
            try {
                const importedModule = await importComponent()

                this.setState({
                    component: importedModule[importKey]
                })
            } catch (error) {
                this.setState({
                    errorOnDynamicLoad: true
                })
            }
        }

        public render() {
            const {errorOnDynamicLoad, component: C} = this.state

            if (errorOnDynamicLoad) {
                return (
                    <Typography>
                        Error loading {importKey}. Please check your network connection and reload this page.
                    </Typography>
                )
            }

            return C ? <C {...this.props} /> : null
        }
    }

    return AsyncComponent
}
