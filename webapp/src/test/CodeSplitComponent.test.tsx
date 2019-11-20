import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react"
import * as React from "react"

import { codeSplit } from "../CodeSplitComponent"

it("should render error information if async import fails", async() => {
  // given
  const Component = codeSplit(() => Promise.reject("any error on dynamic import"), "AboutPage")

  // when
  const { findByText } = render(<Component />)

  // then
  expect(await findByText(
    "Error loading AboutPage. Please check your network connection and reload this page."
  )).toBeInTheDocument()
})
