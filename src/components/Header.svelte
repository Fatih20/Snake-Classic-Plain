<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    gameIsPaused,
    gameIsOver,
    gameState,
    modalOpen,
    bindings,
  } from "../stores";

  const dispatch = createEventDispatcher();
  function sendResetGame() {
    dispatch("resetGame");
  }
</script>

<head>
  <script
    src="https://kit.fontawesome.com/31a5898fa1.js"
    crossorigin="anonymous"></script>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
    integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
    rel="stylesheet"
  />
</head>

<main>
  <div
    class="width-constrain"
    style={$gameState === "playing"
      ? "justify-content: space-between;"
      : "justify-content: center;"}
  >
    <!-- <button>Bruh</button> -->
    <button
      on:click={!$gameIsOver
        ? () =>
            gameIsPaused.update(
              (gameIsPaused) => (gameIsPaused = !gameIsPaused)
            )
        : sendResetGame}
      class="header-button left-button"
      style="width: 20px;"
      class:shown-button={$gameState === "playing"}
    >
      {#if $gameIsPaused}
        <i class="fa-solid fa-play icon" />
      {:else}
        <i class="fa-solid fa-pause icon" />
      {/if}
    </button>
    <h1
      id="title"
      on:click={() => {
        gameIsPaused.set(true);
        gameState.set("startPage");
      }}
    >
      Snake Classic
    </h1>
    <button
      class="header-button right-button"
      style="width: 26px;"
      class:shown-button={$gameState === "playing"}
      on:click={() => {
        gameIsPaused.set(true);
        modalOpen.set(true);
      }}
    >
      <i
        class="fa-solid fa-gear gear-icon"
        class:gear-icon-opened={$modalOpen}
      />
    </button>
  </div>
</main>

<style>
  main {
    --font-size: 1.5em;
    align-items: center;
    background-color: rgb(var(--primary-color));
    box-sizing: border-box;
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    /* height: var(--header-height); */
    justify-content: center;
    padding: 0.25em 1em;
    width: 100%;
  }

  main * {
    color: rgb(var(--text-on-primary-element-color));
  }

  .width-constrain {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    width: min(100%, 400px);

    /* border: solid 1px white; */
  }

  #title {
    cursor: pointer;
    font-size: calc(var(--font-size) + 0.2em);
    font-family: "Pacifico", cursive;
    font-weight: 400;
    user-select: none;
    /* border: solid 1px white; */
  }

  .gear-icon {
    transition: transform 0.25s ease-in-out;
  }

  .gear-icon-opened {
    transform: rotate(90deg);
  }

  .header-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: white;
    cursor: pointer;
    display: none;
    font-size: var(--font-size);
    margin: 0;
    padding: 0;

    /* border: solid 1px white; */
  }

  .left-button {
    justify-content: left;
  }

  .right-button {
    justify-content: right;
  }

  .icon {
    display: block;
    /* border: solid 1px white; */
  }

  .shown-button {
    display: flex;
  }
</style>
