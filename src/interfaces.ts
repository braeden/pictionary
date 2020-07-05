export interface Drawing {
    lineWidth?: number,
    hue?: number,
    old?: Point,
    updated?: Point,
    width?: number,
    point?: boolean,
    clear?: boolean
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

