# ReplayViewer Code Architecture

Here we are definine the *ideal* code architecture for the 3D Viewer and associated components.

This may not be an accurate representation of the current code architecture, but should be worked towards nonetheless.

## High Level Overview

```
ReplayViewer: ReactComponent
└─> UI/Overlay: ReactComponent
    └─> Action Buttons: ReactComponent
    └─> Data Displays: ReactComponent
    └─> etc.
└─> ThreeScene: ReactComponent + Three.js
    └─> Field: Class
    └─> Animation/Object Controller: ReactComponent(?)
        └─> Camera Controller: Class
        └─> Car Controller: Class
        └─> Ball Controller: Class
```

The `ReplayViewer` is essentially the main hub for passing data between these various components.

ReplayViewer should pass `replayData` to ThreeScene, as well as setting the replay `mode`.

Data about the current replay should be emitted up from `ThreeScene` to `ReplayViewer`.
`ReplayViewer` Should then relay that data down to the `UI/Overlay` through it's props.

`UI/Overlay` should then delegate it's data between it's children, in order to display data in various ways.     
`UI/Overlay` should also emit events up to ReplayViewer which should be relayed to `ThreeScene` through it's props.

In this manner, `ReplayViewer` should know about all data and interfaces for *both* the 3D Viewer *and* the UI Overlay.

If possible, `ReplayViewer` should avoid directly modifying or changing data.

### ReplayViewer

Props:  
```ts
replayData: ReplayData // Received from server on mount
```

State:  
```ts
viewerMode: Mode // Viewer Mode - Replay, Shot, Stats
```

Functions:  
```ts
onChangeFrame()
onChangeViewer()
onChangeCamera()
```

### UI / Overlay

Props:  
```ts
gameTime: integer
score: Obejct
currentFrame: Integer
totalFrames: Integer
```

Emits:  
```ts
gotoFrame(frame: integer)
setCameraView(view: string or Symbol)
...etc
```

### ThreeScene:

Props:  
```ts
replayData: Object containing frame arrays
currentFrame: integer
mode: string
```

TODO: Finish Architecture for ThreeScene

### Animation / Object Controller

This is in charge of `tick` for updating all child animation components on the same clock tick.

This is also in charge of instantiating the correct Camera Controller for the current Viewer `mode`.

Props:  
```ts
mode: string
targetFrame: integer // Frame we want to animate to (if we are not currently on) 
```

Functions:  
```ts
startClock()
stopClock()
tick()
```

---

This file is not yet finalized, and help refining the architecture or improving the current documentation is appreciated.

Questions, comments, concerns, and suggestions should be directed towards XanderLuciano or dtracers. 
