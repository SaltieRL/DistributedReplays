import "@testing-library/jest-dom/extend-expect"
import {render, wait} from "@testing-library/react"
import {createBrowserHistory} from "history"
import * as React from "react"
import {Router} from "react-router-dom"
import {doGet} from "../apiHandler/apiHandler"
import {PLAYER_PAGE_LINK, REPLAY_PAGE_LINK} from "../Globals"
import * as getPlayer from "../Requests/Player/getPlayer"
import * as getRanks from "../Requests/Player/getRanks"
import {WrappedApp} from "../WrappedApp"
import {mockImplementationGetPlayer, mockImplementationGetRank, TEST_PLAYER_ID} from "./mocks"

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

    test("should render player page at /player/TESTPLAYERID; gets player profile", async () => {
        const mockGetPlayer = jest.spyOn(getPlayer, "getPlayer").mockImplementation(mockImplementationGetPlayer)
        const mockGetRanks = jest.spyOn(getRanks, "getRanks").mockImplementation(mockImplementationGetRank)

        const history = createBrowserHistory()
        history.push(PLAYER_PAGE_LINK(TEST_PLAYER_ID))
        const app = render(
            <Router history={history}>
                <WrappedApp />
            </Router>
        )

        await wait(() => expect(mockGetPlayer).toHaveBeenCalledWith(TEST_PLAYER_ID))
        await wait(() => expect(mockGetRanks).toHaveBeenCalledWith(TEST_PLAYER_ID))

        expect(doGet).toHaveBeenCalledWith(`/player/${TEST_PLAYER_ID}/match_history?page=0&limit=10`)
        // see https://github.com/SaltieRL/DistributedReplays/issues/458
        // expect(doGet).toHaveBeenCalledWith(`/player/${TEST_PLAYER_ID}/play_style?playlist=13`)

        // see https://github.com/SaltieRL/DistributedReplays/issues/458
        // expect(() => app.getByText("Stats")).not.toThrow()
        expect(() => app.getByText("Ranks")).not.toThrow()
        // see https://github.com/SaltieRL/DistributedReplays/issues/458
        // expect(() => app.getByText("Playstyle")).not.toThrow()
        expect(() => app.getByText("Match History")).not.toThrow()
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
