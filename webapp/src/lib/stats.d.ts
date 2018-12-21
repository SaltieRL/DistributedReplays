/**
 * This declaration file is based on the built stats code revision 16 from:
 * https://github.com/mrdoob/stats.js/raw/master/build/stats.js
 */

export declare class Stats {
    addPanel(id: number): void
    /**
     * 0: fps, 1: ms, 2: mb, 3+: custom
     * @param id number referenced above
     */
    showPanel(id: number): void
    begin(): void
    end(): void
    update(): void
    dom: HTMLElement
    Panel: Panel
}

declare class Panel {
    dom: HTMLCanvasElement
    update(value: number, maxValue: number): void
}