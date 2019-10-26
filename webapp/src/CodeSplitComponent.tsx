import React, { Component, ComponentType } from "react"

type Props = any

interface State {
  component: ComponentType | null
}

export const codeSplit = (importComponent: () => Promise<any>, importKey: string) => {
  class AsyncComponent extends Component<Props, State> {
    constructor(props: Props) {
      super(props)

      this.state = {
        component: null
      }
    }

    public async componentDidMount() {
      const importedModule = await importComponent()

      this.setState({
        component: importedModule[importKey]
      })
    }

    public render() {
      const C = this.state.component

      return C ? <C {...this.props} /> : null
    }
  }

  return AsyncComponent
}
