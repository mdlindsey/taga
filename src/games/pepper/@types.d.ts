// Outward facing GameModel
export interface GameModel {
    readonly data: RoundData[]
    readonly round: RoundModel
    readonly state: ActionState
    readonly score: ScoreModel
    normalize(): void // Populates this.round
    reduce(): void // Populates this.state
    interact(action: ActionInput): GameModel
}
// ActionState dictates next move expectations
export interface ActionState {
    actionId: number
    playerIndex: number
    actionModifier: number // eg: on action PLAY modifier is suitId
}
// ActionInput is input by user for next move
export interface ActionInput {
    actionId: number
    playerIndex: number
    actionPayload: number // eg: card being played
}
// Raw data (from db)
export interface RoundData {
    hands: Hand[]
    actions: ActionData[]
}
export interface ActionData {
    actionId: number
    actionPayload: number
}
// Modeling
export type Hand = number[];
export type ScoreModel = { tricks: number, score: number }[];
export interface RoundModel {
    bids: number[]
    swaps: number[]
    trump: number
    plays: number[]
    hands: Hand[]
}