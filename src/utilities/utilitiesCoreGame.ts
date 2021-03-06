import { CellCoordinate, DirectionVectorType, makePossibleCoordinate, Direction, possibleDirection, makePossibleVectorValue, IBindingsInfo } from "./types";
import { directionToVectorDict, oppositeDirectionDictionary, randomizeFrom0ToNMinus1, randomizeFrom1ToN } from "./utilities";
import { gridSize } from "../config";

export function mover(
    movedCoordinate: CellCoordinate,
    { x: incrementX, y: incrementY }: DirectionVectorType,
    multiplier : number = 1
  ): CellCoordinate {
    let newX = movedCoordinate.x + incrementX * multiplier;
    let newY = movedCoordinate.y + incrementY * multiplier;
    if (newX > gridSize) {
      newX = 1;
    } else if (newX < 1) {
      newX = gridSize;
    }

    if (newY > gridSize) {
      newY = 1;
    } else if (newY < 1) {
      newY = gridSize;
    }

    return { x: makePossibleCoordinate(newX), y: makePossibleCoordinate(newY) };
  }

  export function wholeSnakeCoordinateListInitialGenerator(
    headCoordinate: CellCoordinate,
    direction: Direction,
    length : number
  ) {
    const oppositeDirectionVector = directionToVectorDict[oppositeDirectionDictionary[direction]];
    return [headCoordinate, ...Array.from({length : length - 1}, (_, i) => mover(headCoordinate, oppositeDirectionVector, i + 1))]
  }

export function randomCoordinate () {
    return {x : makePossibleCoordinate(randomizeFrom1ToN(gridSize)), y : makePossibleCoordinate(randomizeFrom1ToN(gridSize))} as CellCoordinate;
}

export function randomDirection () {
    return possibleDirection[(randomizeFrom1ToN(4)-1)];
}

export function randomUniqueCoordinateGenerator (filledCoordinateList : CellCoordinate[], allCoordinateList : CellCoordinate[], numberOfCoordinate : number) {
    const filledCoordinateStringifiedSet = new Set(filledCoordinateList.map((coordinate) => JSON.stringify(coordinate)));
    const allCoordinateStringifiedSet = new Set(allCoordinateList.map((coordinate) => JSON.stringify(coordinate)));

    let emptyCoordinateSet = new Set<CellCoordinate>();

    allCoordinateStringifiedSet.forEach((coordinate) => {
        if (!filledCoordinateStringifiedSet.has(coordinate)) {
            emptyCoordinateSet.add(JSON.parse(coordinate));
        }
    });

    let emptyCoordinateList = Array.from(emptyCoordinateSet);

    if (numberOfCoordinate >= emptyCoordinateList.length) {
        return [] as CellCoordinate[]
    } else {
        let randomUniqueCoordinateList = [] as CellCoordinate[];
        for (let i = 0; i < numberOfCoordinate; i++) {
            const randomIndex = randomizeFrom0ToNMinus1(emptyCoordinateList.length);
            randomUniqueCoordinateList.push(emptyCoordinateList[randomIndex])
            emptyCoordinateList.splice(randomIndex, 1);
        }
        return randomUniqueCoordinateList;
    }
}

export function positionRelativeTo ({x : xFrom, y : yFrom} : CellCoordinate, {x : xTo, y : yTo} : CellCoordinate) {
    const incrementX = xTo - xFrom;
    const incrementY = yTo - yFrom;
    let directionVectorOneToTwo : DirectionVectorType;
    
    if (incrementX < -1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(1), y : makePossibleVectorValue(0)}    
    } else if (incrementX > 1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(-1), y : makePossibleVectorValue(0)}
    } else if (incrementY < -1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(0), y : makePossibleVectorValue(1)}    
    } else if (incrementY > 1) {
        directionVectorOneToTwo = {x : makePossibleVectorValue(0), y : makePossibleVectorValue(-1)}
    } else {
    directionVectorOneToTwo = {x : makePossibleVectorValue(incrementX), y : makePossibleVectorValue(incrementY)}}

    return Object.keys(directionToVectorDict).filter((directionName : Direction) =>
        JSON.stringify(directionToVectorDict[directionName]) === JSON.stringify(directionVectorOneToTwo))[0] as Direction;
}

export function wholeSnakeCoordinateListUpdater(
    wholeSnakeCoordinateList: CellCoordinate[],
    directionVector : DirectionVectorType,
    howManyTail: number = 0
  ) {
    wholeSnakeCoordinateList.unshift(mover(wholeSnakeCoordinateList[0], directionVector))
    wholeSnakeCoordinateList.pop()

    const tailDirection = positionRelativeTo(
      wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
      wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1]
    );
    const directionVectorFromLastTail =
      directionToVectorDict[tailDirection];
    const newTailCoordinateList = Array.from({length : howManyTail}, (_, i) => {
      return mover(wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 1], directionVectorFromLastTail, i + 1)
    })
    return [
      ...wholeSnakeCoordinateList,
      ...newTailCoordinateList,
    ];
}

export function cornerOfSnakeBodyGenerator(wholeSnakeCoordinateList: CellCoordinate[]) {
    return wholeSnakeCoordinateList.map((snakeCoordinate, index) => {
      if (index === 0 || index === wholeSnakeCoordinateList.length - 1) {
        const directionFromNextCoordinate = positionRelativeTo(
          index === 0
            ? wholeSnakeCoordinateList[1]
            : wholeSnakeCoordinateList[wholeSnakeCoordinateList.length - 2],
          snakeCoordinate
        );

        return `${directionFromNextCoordinate.toLowerCase()}`;
      } else {
        const directionFromPreviousCell = positionRelativeTo(
          wholeSnakeCoordinateList[index - 1],
          snakeCoordinate
        );
        const directionFromNextCell = positionRelativeTo(
          wholeSnakeCoordinateList[index + 1],
          snakeCoordinate
        );
        return (oppositeDirectionDictionary[directionFromPreviousCell] ===
          directionFromNextCell ? `` : `${directionFromPreviousCell.toLowerCase()}-${directionFromNextCell.toLowerCase()}`)
      }
    });
}

export function checkIfHeadBiteBody(wholeSnakeCoordinateList: CellCoordinate[]) {
  const { x: headX, y: headY } = wholeSnakeCoordinateList[0];
    return wholeSnakeCoordinateList.slice(1).some(({x : bodyX, y : bodyY}) => (headX === bodyX && headY === bodyY)
    );
}

export function keyToDirectionConverter (key : string, directionToKeyList : IBindingsInfo) {
  return (Object.keys(directionToKeyList).filter((direction : Direction) => {
    if (directionToKeyList[direction].includes(key)) {
      return true;
    } 
    return false;
  })[0] ?? null) as Direction | null;
}