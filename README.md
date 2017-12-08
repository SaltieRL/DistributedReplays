# Saltie Replay Server

A replay collection server for [Saltie](https://github.com/RLBots/Saltie) the Deep Reinforcement Learning Bot

*Modeled after the [Leela Zero](https://github.com/gcp/leela-zero) distributed Go engine.*

## Setup

- Install Flask (`flask`).
- Run RLBotServer.py.

The server currently only allows uploads from a single IP address every 4.5 minutes, to prevent abuse.
This is also in-line with the data generation speed of a typical Rocket League game (~5 minutes).
Each replay has an IP address attached to it, so blame can be given.
## Replays

Replays will be saved in `/replays` for later consumption. The server will eventually serve up the replays to training clients.
