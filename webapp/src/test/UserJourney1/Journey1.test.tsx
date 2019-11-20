import "@testing-library/jest-dom/extend-expect"
import {render, wait, waitForElement} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {createBrowserHistory} from "history"
import * as React from "react"
import {Router} from "react-router-dom"
import {StatChart} from "../../Components/Shared/Charts/StatChart"
import {BasicStat} from "../../Models"
import * as getMatchHistory from "../../Requests/Player/getMatchHistory"
import * as getPlayer from "../../Requests/Player/getPlayer"
import * as getPlayStyle from "../../Requests/Player/getPlayStyle"
import * as getRanks from "../../Requests/Player/getRanks"
import * as getStats from "../../Requests/Player/getStats"
import * as resolvePlayerNameOrId from "../../Requests/Player/resolvePlayerNameOrId"
import * as ReplayRequests from "../../Requests/Replay"
import {WrappedApp} from "../../WrappedApp"
import {
    mockImplementationGetMatchHistory,
    mockImplementationGetPlayer,
    mockImplementationGetReplay,
    mockImplementationGetReplayPlayerStats,
    mockImplementationResolvePlayerNameOrID,
    testGetPlayerName,
    testPlayerName,
    testReplayId,
    testReplayName
} from "./mocks"

jest.mock("../../apiHandler/apiHandler", () => ({
    doGet: jest.fn(() => Promise.resolve())
}))

jest.mock("../../Components/Replay/ReplayChart")
jest.mock("../../Components/Player/Overview/SideBar/PlayerRanksCard")
jest.mock("../../Components/Shared/Charts/StatChart", () => ({
    StatChart: jest.fn(() => null)
}))

test("should render", async () => {
    jest.setTimeout(60000)

    // Load HomePage
    const history = createBrowserHistory()
    history.push("/")
    const app = render(
        <Router history={history}>
            <WrappedApp />
        </Router>
    )
    // app.debug()

    // Check search bar and button exists
    const getSearchBar = () => app.getByPlaceholderText("Enter a steamId or username")
    const getSearchButton = () => app.getByLabelText("Search")
    expect(getSearchBar).not.toThrow()
    expect(getSearchButton).not.toThrow()
    const searchBar = getSearchBar()
    const searchButton = getSearchButton()

    const mockResolvePlayerNameOrId = jest
        .spyOn(resolvePlayerNameOrId, "resolvePlayerNameOrId")
        .mockImplementation(mockImplementationResolvePlayerNameOrID)

    const mockGetPlayer = jest.spyOn(getPlayer, "getPlayer").mockImplementation(mockImplementationGetPlayer)

    const mockGetMatchHistory = jest
        .spyOn(getMatchHistory, "getMatchHistory")
        .mockImplementation(mockImplementationGetMatchHistory)

    const mockGetStats = jest.spyOn(getStats, "getStats")
    const mockGetRanks = jest.spyOn(getRanks, "getRanks")
    const mockGetPlayStyle = jest.spyOn(getPlayStyle, "getPlayStyle")

    // Type into search bar and click search button
    await userEvent.type(searchBar, testPlayerName)
    userEvent.click(searchButton)
    console.log("Clicked search button")

    // Wait for redirect to player page
    await waitForElement(() => app.getByText(testGetPlayerName))

    // Check that player name resolving has been called
    expect(mockResolvePlayerNameOrId.mock.calls.length).toBe(1)

    // Check that all player queries have been performed
    expect(mockGetPlayer.mock.calls.length).toBe(1)
    expect(mockGetMatchHistory.mock.calls.length).toBe(1)
    expect(mockGetStats.mock.calls.length).toBe(1)
    expect(mockGetRanks.mock.calls.length).toBe(0) // PlayerRanksCard component mocked above, request is not made.
    expect(mockGetPlayStyle.mock.calls.length).toBe(1)

    // Check that replay name and button is displayed
    const getReplayNameHeader = () => app.getByText(testReplayName)
    const getReplayButton = () => app.container.querySelector(`a[href="/replays/${testReplayId}"]`)
    expect(getReplayNameHeader).not.toThrow()
    expect(getReplayButton).not.toBeNull()

    const replayButton = getReplayButton()!

    const mockGetReplayPlayerStats = jest
        .spyOn(ReplayRequests, "getReplayPlayerStats")
        .mockImplementation(mockImplementationGetReplayPlayerStats as (id: string) => Promise<BasicStat[]>)
    const mockGetReplay = jest.spyOn(ReplayRequests, "getReplay").mockImplementation(mockImplementationGetReplay)

    // Clear StatChart mock in prep for ReplayPage load
    // @ts-ignore
    StatChart.mockClear()

    // Click replay button
    userEvent.click(replayButton)
    console.log("Clicked replay button")

    // await wait(() => expect(window.location.assign).toHaveBeenCalledWith(`/replays/${testReplayId}`))
    // await wait(() => expect(window.location.assign).toHaveBeenCalled())

    // Wait for redirect to replay page, look for ReplayTabs component
    await waitForElement(() => app.getByText("Player Stats"))

    // Wait for getReplay to be called
    // await waitForElement(() => expect(mockGetReplay.mock.calls.length).toBe(1))

    // Check that all player queries have been performed
    expect(mockGetReplay.mock.calls.length).toBe(1)

    // This request is called in a child component (PlayerStatsChart) within ReplayTabs, wait to avoid race condition.
    await wait(() => expect(mockGetReplayPlayerStats.mock.calls.length).toBe(1))

    expect(StatChart).toHaveBeenCalled()
    // @ts-ignore
    console.log(`StatChart called ${StatChart.mock.calls.length} times`)
})
