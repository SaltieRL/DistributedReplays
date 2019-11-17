import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react"
import * as React from "react"
import { WrappedApp } from "./WrappedApp"

test("full render", async() => {
    const app = render(
        <WrappedApp/>
    )

    expect(app)
})
