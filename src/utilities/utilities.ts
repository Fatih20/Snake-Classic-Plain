import { CellCoordinate, Direction, IAPIReturn, IBindingsInfo, IDirectionToVector, makePossibleCoordinate, OppositeDirectionDictionaryType, possibleAPIMethodType } from "./types";
import { gridSize } from "../config";
import {
    possibleDirectionVector, } from "./types";

export function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomizeFrom0ToNMinus1 (N : number) {
    return Math.floor(Math.random() * N)
}

export const directionToVectorDict : IDirectionToVector = {
    Up : possibleDirectionVector[0],
    Down : possibleDirectionVector[1],
    Right : possibleDirectionVector[2],
    Left : possibleDirectionVector[3],
}

export const oppositeDirectionDictionary : OppositeDirectionDictionaryType = {
    "Up" : "Down",
    "Down" : "Up",
    "Left" : "Right",
    "Right" : "Left"
}

export function allCoordinateMaker (gridSize : number) {
    let allCoordinateList = [] as CellCoordinate[];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            allCoordinateList.push({x : makePossibleCoordinate(i), y : makePossibleCoordinate(j)})
        }
    }
    return allCoordinateList;
}

export const allCoordinateList = allCoordinateMaker(gridSize)

export function fetchItemFromLocalStorage (key : string){
    let candidateResult = localStorage.getItem(key);
    if (candidateResult !== undefined && candidateResult !== null) {
        return JSON.parse(candidateResult)
    } else {
        return undefined
    }
}


export function updateBindingFirstElement(newKey : string, changedDirection : Direction, previousBinding : IBindingsInfo){
    Object.keys(previousBinding).forEach((direction : Direction) => {
        if (direction === changedDirection) {
            return;
        }

        if (previousBinding[direction][0] === newKey) {
            previousBinding[direction][0] = "";
        }
    })

    previousBinding[changedDirection][0] = newKey;

    return previousBinding;

}