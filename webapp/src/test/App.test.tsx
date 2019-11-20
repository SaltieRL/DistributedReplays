import "@testing-library/jest-dom/extend-expect"
import {render, wait} from "@testing-library/react"
import {createBrowserHistory} from "history"
import * as React from "react"
import {Router} from "react-router-dom"
import {doGet} from "../apiHandler/apiHandler"
import {PLAYER_PAGE_LINK, REPLAY_PAGE_LINK} from "../Globals"
import {WrappedApp} from "../WrappedApp"

jest.mock("../apiHandler/apiHandler", () => ({
    doGet: jest.fn(() => Promise.resolve())
}))

describe("should route", () => {
    jest.setTimeout(60000)

    test("should render home page at /; get replay count and user", () => {
        const history = createBrowserHistory()
        history.push("/")
        render(
            <Router history={history}>
                <WrappedApp />
            </Router>
        )
        expect(doGet).toHaveBeenCalledWith("/global/replay_count")
        expect(doGet).toHaveBeenCalledWith("/me")
    })

    test("should render home page at /TESTUNKNOWN; get replay count and user", () => {
        const history = createBrowserHistory()
        history.push("/TESTUNKNOWN")
        render(
            <Router history={history}>
                <WrappedApp />
            </Router>
        )
        expect(doGet).toHaveBeenCalledWith("/global/replay_count")
        expect(doGet).toHaveBeenCalledWith("/me")
    })

    test("should render player page at /player/TESTPLAYERID; gets player profile", () => {
        const history = createBrowserHistory()
        const TEST_PLAYER_ID = "TESTPLAYERID"
        history.push(PLAYER_PAGE_LINK(TEST_PLAYER_ID))
        const app = render(
            <Router history={history}>
                <WrappedApp />
            </Router>
        )

        expect(doGet).toHaveBeenCalledWith(`/player/${TEST_PLAYER_ID}/profile`)

        // The following calls are not made unless the above call returns a player.
        // `/player/${TEST_PLAYER_ID}/match_history?page=0&limit=10`,
        // expect(doGet).toHaveBeenCalledWith(`/player/${TEST_PLAYER_ID}/profile_stats`)
        // `/player/${TEST_PLAYER_ID}/play_style?playlist=13`

        expect(app.getByText("Stats")).not.toThrow()
        expect(app.getByText("Rank")).not.toThrow()
        expect(app.getByText("Playstyle")).not.toThrow()
        expect(app.getByText("Match History")).not.toThrow()
    })

    test("should render replay page at /replay/TESTREPLAYID; gets replay", async () => {
        const history = createBrowserHistory()
        const TEST_REPLAY_ID = "TESTREPLAYID"
        history.push(REPLAY_PAGE_LINK(TEST_REPLAY_ID))
        render(
            <Router history={history}>
                <WrappedApp />
            </Router>
        )

        await wait(() => expect(doGet).toHaveBeenCalledWith(`/replay/${TEST_REPLAY_ID}`))

        // Query only called if replay is returned.
        // await wait(() => expect(doGet).toHaveBeenCalledWith(`/replay/${TEST_REPLAY_ID}/basic_player_stats`))
    })
})
