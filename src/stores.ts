import { readable, writable } from "svelte/store";
import {defaultBinding, initialLength, initialRefreshTime, numberOfFruitSpawned } from "./config";
import type { Direction, IAchievementInfo, IBindingsInfo, InitialBindingType, ISavedGameInfo, possibleGameStateType, UpdateAchievementPayload, UpdateSavedGamePayload } from "./utilities/types";
import { allCoordinateList, fetchItemFromLocalStorage, updateBindingFirstElement } from "./utilities/utilities";
import { randomCoordinate, randomDirection, randomUniqueCoordinateGenerator, wholeSnakeCoordinateListInitialGenerator } from "./utilities/utilitiesCoreGame";

export const deviceWidth = readable(screen.width);

function createSavedGame () {
    const {subscribe, set, update} = writable(fetchSavedGameFromLocalStorage());

    function fetchSavedGameFromLocalStorage() {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    return (candidateSavedGame ?? createNewSavedGame()) as ISavedGameInfo;
    }

    function createNewSavedGame () {
        const direction = randomDirection()
        const wholeSnakeCoordinateList = wholeSnakeCoordinateListInitialGenerator(
            randomCoordinate(),
            direction,
            initialLength
          );
        return {
            "direction" : direction,
            "wholeSnakeCoordinateList" : wholeSnakeCoordinateList,
            "fruitPositionList" :  randomUniqueCoordinateGenerator(
                wholeSnakeCoordinateList,
                allCoordinateList,
                numberOfFruitSpawned
              ),
            "fruitEaten" : 0,
            "score" : 0,
            "currentRefreshTime" : initialRefreshTime,
        } as ISavedGameInfo
    }

    function updatePartOfSavedGame (payload : UpdateSavedGamePayload) {
        update (previousSavedGame => {
            const overriderObject = {[payload.updatedValue] : payload.newValue};
            const newObject = {
                ...previousSavedGame,
                ...overriderObject
            }
            localStorage.setItem("savedGame", JSON.stringify(newObject));
            return newObject;
        })
    }
    async function reset () {
        const newSavedGame = createNewSavedGame();
        localStorage.removeItem("savedGame");
        set(newSavedGame);
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("savedGame");
    }

    return {
        subscribe,
        reset,
        set,
        removeFromLocalStorage,
        updatePartOfSavedGame,
        fetchSavedGameFromLocalStorage
    }
}

function createAchievement () {
    const {subscribe, set, update} = writable(fetchAchievementFromLocalStorage());

    function fetchAchievementFromLocalStorage() {
        const candidateAchievement = fetchItemFromLocalStorage("achievement");
        const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
        return (candidateAchievement ?? createNewAchievement(
            (candidateAchievement === undefined ? 0 : (candidateSavedGame as ISavedGameInfo).wholeSnakeCoordinateList.length)
        )) as IAchievementInfo
    }

    function createNewAchievement (length = 0) {
        return {
            "highScore" : 0,
            "longestLength" : length
        } as IAchievementInfo
    }

    function updatePartOfAchievement (payload : UpdateAchievementPayload) {
        update (previousSavedGame => {
            const overriderObject = {[payload.updatedValue] : payload.newValue};
            const newObject = {
                ...previousSavedGame,
                ...overriderObject
            }
            localStorage.setItem("achievement", JSON.stringify(newObject));
            return newObject;
        })
    }

    function setDataFromServer (savedGameFromServer : IAchievementInfo) {
        set({...savedGameFromServer})
    }

    function reset () {
        localStorage.removeItem("achievement");
        set(createNewAchievement());
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("achievement");
    }

    return {
        subscribe,
        reset,
        set,
        fetchAchievementFromLocalStorage,
        removeFromLocalStorage,
        setDataFromServer,
        updatePartOfAchievement
    }
}

function createBindings () {
    const {subscribe, set, update} = writable(fetchBindingsFromLocalStorage());

    function fetchBindingsFromLocalStorage() {
        const candidateBindings = fetchItemFromLocalStorage("bindings");
        return (candidateBindings ?? defaultBinding) as IBindingsInfo
    }

    function changeFirstElementPartOfBindings (newKey : string, changedDirection : Direction) {
        update (previousBinding => {
            const newBinding =  updateBindingFirstElement(newKey, changedDirection, previousBinding); 
            localStorage.setItem("bindings", JSON.stringify(newBinding));
            return newBinding;
        })
    }

    function setDataFromServer (savedGameFromServer : IBindingsInfo) {
        set({...savedGameFromServer})
    }

    function reset () {
        localStorage.removeItem("bindings");
        set(defaultBinding);
    }

    function removeFromLocalStorage() {
        localStorage.removeItem("bindings");
    }

    return {
        subscribe,
        reset,
        set,
        fetchBindingsFromLocalStorage,
        removeFromLocalStorage,
        setDataFromServer,
        changeFirstElementPartOfBindings
    }
}

export const savedGame = createSavedGame();
export const achievement = createAchievement();

export const firstStart = writable(fetchItemFromLocalStorage("savedGame") === undefined);
export const gameState = writable("startPage" as possibleGameStateType);
export const gameIsPaused = writable(fetchItemFromLocalStorage("savedGame") !== undefined);
export const gameIsOver = writable(false);
export const modalOpen = writable(false);
export const initialBindingModalJustOpened = writable(null as InitialBindingType);

export const bindings = createBindings();
