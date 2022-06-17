import type { IBindingsInfo } from "./utilities/types";

export const gridSize = 20;
export const initialRefreshTime = 750;
export const refreshTimeDecrementEveryTurn = 1;
export const refreshTimeMultiplierEveryTurn = 0.995
export const refreshTimeLowerBound = 300;
export const numberOfFruitSpawned = 3;
export const turnIntervalBetweenFruitSpawn = 4;
export const numberOfTailAddedAfterEating = 1;
export const scoresAfterEveryFruit = 7;
export const initialLength = 4;
export const mainMenuTransitionDuration = 250;
export const modalTransitionDuration = 250;
export const modalTransitionOffset = 250;
export const delayUntilGameStarts = 500 + mainMenuTransitionDuration;
export const defaultBinding : IBindingsInfo = {Up : ["w", "ArrowUp"], Down : ["s", "ArrowDown"], Left : ["a", "ArrowLeft"], Right : ["d", "ArrowRight"]}