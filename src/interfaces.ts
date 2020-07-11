export interface Drawing {
    l?: number, //LineWidth
    h?: number, //Hue
    old?: Point, //Old
    up?: Point, //Updated
    w?: number, //Width
    p?: boolean, //Point
    clear?: boolean,
    undo?: boolean
}

export interface RequestSyncInput {
    requestID: string
}

export interface RequestSyncOutput extends RequestSyncInput {
    draws: Drawing[]
}

export interface Point {
    x: number,
    y: number
}

