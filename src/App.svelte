<script lang="ts">
  import Header from "./components/Header.svelte";
  import Game from "./components/Game.svelte";
  import Footer from "./components/Footer.svelte";
  import StartPage from "./components/StartPage.svelte";
  import { fade, fly } from "svelte/transition";
  import {
    gameIsOver,
    savedGame,
    gameState,
    gameIsPaused,
    achievement,
    modalOpen,
    bindings,
  } from "./stores";
  import { onMount } from "svelte";
  import type { ISavedGameInfo } from "./utilities/types";
  import AccountModal from "./components/AccountModal.svelte";
  import {
    mainMenuTransitionDuration,
    modalTransitionDuration,
    modalTransitionOffset,
  } from "./config";

  async function handleCloseModal() {
    modalOpen.set(false);
  }

  async function resetCoreGame() {
    await savedGame.reset();
    gameIsOver.set(false);
    gameIsPaused.set(false);
  }

  $: {
    if ($gameState !== "playing") {
      setTimeout(() => {
        modalOpen.set(false);
      }, modalTransitionDuration);
    }
  }
</script>

<main>
  {#if $gameState === "startPage"}
    <!-- {#if $gameState === "startPage"} -->
    <StartPage />
  {:else}
    <div
      class="main-app-container"
      in:fade={{
        delay: mainMenuTransitionDuration / 2,
        duration: mainMenuTransitionDuration / 2,
      }}
      out:fade={{ duration: mainMenuTransitionDuration / 2 }}
    >
      {#if $modalOpen}
        <div
          class="absolute-container"
          class:absolute-container-visible={$modalOpen}
          on:click={handleCloseModal}
        >
          <AccountModal />
          <div class="spacer" />
          <p
            class="in-overlay-text modal-closing-text"
            in:fly={{
              duration: modalTransitionDuration,
              y: modalTransitionOffset,
            }}
            out:fly={{
              duration: modalTransitionDuration,
              y: modalTransitionDuration,
            }}
          >
            Click anywhere but the modal to close it
          </p>
        </div>
      {/if}
      <Header on:resetGame={resetCoreGame} />
      <Game {resetCoreGame} />
      <Footer />
    </div>
  {/if}
</main>

<style>
  main {
    --header-height: 50px;
    --footer-height: 50px;
    --gap-between-parts: 1em;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--gap-between-parts);
    height: 100vh;
    justify-content: center;
    overflow-y: hidden;
    width: 100%;
    /* border: solid 1px white; */
  }

  .main-app-container {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--gap-between-parts);
    justify-content: center;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .absolute-container {
    align-items: center;
    bottom: 0;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    left: 0;
    /* opacity: 0; */
    right: 0;
    position: absolute;
    padding: 2em;
    top: 0;
    transition: all 0.25s ease-in-out;
    /* visibility: hidden; */
    z-index: 1000;
  }

  .absolute-container-visible {
    /* background-color: rgba(0, 0, 0, 0.5); */
    display: flex;
    /* opacity: 1; */
    pointer-events: all;
    /* visibility: visible; */
  }

  .in-overlay-text {
    border-radius: var(--button-radius);
    display: inline-block;
    user-select: none;
    padding: 0.25em 0.5em;
    text-align: center;
  }

  .modal-closing-text {
    background-color: rgb(var(--primary-color));
    color: rgb(var(--text-on-primary-element-color));
  }

  .modal-error-text {
    background-color: rgb(var(--warning-color-bg));
    color: rgb(var(--text-on-primary-element-color));
  }

  .spacer {
    flex-grow: 1;
  }
</style>
