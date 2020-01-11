import { Button } from "@material-ui/core"
import React from "react"
import { GameManager } from "replay-viewer"
import { addFrameListener, FrameEvent } from "replay-viewer/eventbus/events/frame"
import { addPlayPauseListener, PlayPauseEvent } from "replay-viewer/eventbus/events/playPause"
import io from "socket.io-client"

interface Props {
    replayId: string
    gameManager: GameManager
}

interface State {
    socket?: SocketIOClient.Socket
    connection?: RTCPeerConnection
    dataChannel?: RTCDataChannel
    master: boolean
    sid?: string
}


export class Socket extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { master: false }
    }

    public componentDidMount(): void {
        const socket = io("http://" + window.location.hostname + ":843", {
            port: "843"
        })

        const pcConfig = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        }

        socket.on("sid", (id: string) => {
            console.log("My sid:", socket.id)
            this.setState({ sid: socket.id })
        })
        socket.on("join", (room: string) => {
            console.log("Another peer made a request to join room " + room)
            console.log("This peer is the initiator of room " + room + "!")
        })
        socket.on("joined", (room: string) => {
            console.log("Joined: " + room)
        })
        socket.on("created", (room: string) => {
            this.setState({ master: true })
            console.log("Created room " + room)
        })
        socket.on("message", (event: any) => {
            try {
                event = JSON.parse(event)
            } catch {
                console.log(event)
                event = {}
            }

            if (event.sid === this.state.sid) {
                console.log("Got local message")
                return
            }
            if (!event.data) {
                console.log("empty message", event)
                return
            }
            const { desc, candidate } = event.data
            // console.log("message", event)
            if (desc) {
                // console.log("message desc", desc)
                if (this.state.connection) {
                    if (desc.type === "offer") {
                        console.log("Offer desc", desc)
                        if (event.sid === this.state.sid) {
                            console.log("Got local sid from server")
                        } else {
                            console.log("Sid", event.sid, this.state.sid)
                            console.log("Got offer, setting remote....")
                            this.state.connection.setRemoteDescription(desc)
                            console.log("Set remote")
                            console.log(this.state.connection.signalingState)
                            if (!this.state.master) {
                                this.state.connection.createAnswer().then((answer) => {
                                    console.log("Answer", answer)
                                    if (this.state.connection) {
                                        this.state.connection.setLocalDescription(answer)
                                        console.log(this.state.connection.signalingState)
                                    }
                                    if (answer) {
                                        this.sendDesc(answer)
                                    }
                                })
                            }
                        }
                    } else if (desc.type === "answer") {
                        console.log("Got answer")
                        pc.setRemoteDescription(desc)
                    }
                }
            } else if (candidate) {
                console.log("candidate", candidate)
                pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => console.log(err))
            }
        })

        const pc = new RTCPeerConnection(pcConfig)

        pc.onicecandidate = (event: any) => {
            // send candidate across websockets
            console.log("on candidate")
            socket.emit("message", {
                candidate: event.candidate
            })
            // this.handleCandidate(event.candidate, local, "pc1: ", "local")
        }
        pc.ondatachannel = (event) => {
            console.log("On data channel", event)
            event.channel.onmessage = (event) => {
                console.log("message", event)
                const data = JSON.parse(event.data)
                this.props.gameManager.onPlayPause({
                    paused: data.paused === "true"
                })
            }
            this.setState({ dataChannel: event.channel })
        }
        socket.emit("create or join", this.props.replayId)
        console.log("Attempted to create or  join room", this.props.replayId)

        this.setState({ socket, connection: pc })

        addPlayPauseListener((event: PlayPauseEvent) => {
            if (this.state.dataChannel && this.state.dataChannel.readyState === "open") {
                console.log("sent data")
                this.state.dataChannel.send(
                    JSON.stringify({
                        paused: event.paused.toString()
                    })
                )
            }
        })
        addFrameListener((event: FrameEvent) => {
            if (this.state.dataChannel && this.state.dataChannel.readyState === "open") {
                if (event.frame % 60 === 0) console.log("sent data")
                this.state.dataChannel.send(
                    JSON.stringify({
                        frame: event.frame.toString()
                    })
                )
            }
        })
    }

    public componentWillUnmount(): void {
        if (this.state.socket) {
            this.state.socket.emit("disconnect")
        }
    }

    public handleCandidate = (
        candidate: RTCIceCandidateInit | RTCIceCandidate,
        dest: RTCPeerConnection,
        prefix: string,
        type: string
    ) => {
        dest.addIceCandidate(candidate).then(this.onAddIceCandidateSuccess, this.onAddIceCandidateError)
        console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : "(null)"}`)
    }

    public onAddIceCandidateSuccess() {
        console.log("AddIceCandidate success.")
    }

    public onAddIceCandidateError(error: any) {
        console.log(`Failed to add ICE candidate: ${error.toString()}`)
    }

    public render() {
        return (
            <>
                <Button
                    onClick={() => {
                        if (this.state.connection) {
                            const dataChannel = this.state.connection.createDataChannel("jsonData")
                            dataChannel.addEventListener("open", (event) => {
                                console.log("data channel open", event)
                            })
                            this.setState({ dataChannel })
                            this.state.connection.createOffer().then((desc) => {
                                if (this.state.connection) {
                                    this.state.connection.setLocalDescription(desc)
                                    console.log(this.state.connection.signalingState)
                                }
                                if (this.state.socket) {
                                    this.state.socket.emit("message", { desc })
                                    console.log("Sent offer", this.state.sid)
                                }
                            })
                        }
                    }}
                >
                    Create offer
                </Button>
                <Button
                    onClick={() => {
                        if (this.state.dataChannel && this.state.dataChannel.readyState === "open") {
                            console.log("sent data")
                            this.state.dataChannel.send("hello world")
                        }
                    }}
                >
                    send msg
                </Button>
            </>
        )
    }

    // public createPeerConnection() {
    //     try {
    //         const pc = new RTCPeerConnection(pcConfig)
    //         // const sendChannel = pc.createDataChannel("chat", null)
    //         pc.onicecandidate = this.handleIceCandidate
    //         pc.ondatachannel = this.handleChannelCallback
    //
    //         console.log("Created RTCPeerConnnection")
    //     } catch (e) {
    //         console.log("Failed to create PeerConnection, exception: " + e.message)
    //         alert("Cannot create RTCPeerConnection object.")
    //         return
    //     }
    // }

    // public handleIceCandidate = (event: any) => {
    //     console.log("icecandidate event: ", event)
    //     if (event.candidate) {
    //         // sendMessage({
    //         //     type: "candidate",
    //         //     label: event.candidate.sdpMLineIndex,
    //         //     id: event.candidate.sdpMid,
    //         //     candidate: event.candidate.candidate
    //         // })
    //     } else {
    //         console.log("End of candidates.")
    //     }
    // }
    // public handleChannelCallback = (event: any) => {
    //     console.log(event)
    //     // const receiveChannel = event.channel
    //     // receiveChannel.onmessage = onReceiveMessageCallback
    // }

    public sendMessage(message: string) {
        if (this.state.socket) {
            console.log("Client sending message: ", message)
            this.state.socket.emit("message", message)
        }
    }

    public sendDesc(desc: any) {
        if (this.state.socket) {
            console.log("Client sending desc: ", desc)
            this.state.socket.emit("message", {
                desc
            })
        }
    }
}
