<script lang="ts">
  import { bindings, deviceWidth, gameState, modalOpen } from "../stores";

  import type {
    Direction,
    DirectionBeingChangedType,
  } from "../utilities/types";
  import { fly } from "svelte/transition";
  import { modalTransitionDuration, modalTransitionOffset } from "../config";

  let directionBeingChanged = "" as DirectionBeingChangedType;

  function handleKeydown(e) {
    e.preventDefault();
    console.log("Entering handle keydown");
    if (directionBeingChanged === "") {
      return;
    }

    const { key: keyPressed } = e;

    if (keyPressed === "Escape") {
      directionBeingChanged = "";
      return;
    }

    bindings.changeFirstElementPartOfBindings(
      keyPressed,
      directionBeingChanged
    );
    directionBeingChanged = "";
  }

  function typecastToDirection(direction: string) {
    return direction as Direction;
  }
</script>

<main
  on:click={(e) => e.stopPropagation()}
  in:fly={{ duration: modalTransitionDuration, y: -1 * modalTransitionOffset }}
  out:fly={{ duration: modalTransitionDuration, y: -1 * modalTransitionOffset }}
  class:no-settings-main={$deviceWidth < 1000}
>
  <!-- <h2 class="title">Enjoy the game, {$userData.username}!</h2> -->
  {#if $deviceWidth >= 1000}
    <div class="key-binding-container">
      <h3 class="section-title">Key Binding</h3>
      <div class="key-button-container">
        {#each Object.keys($bindings) as direction (direction)}
          <button
            class={`control-button`}
            id={direction.toLowerCase()}
            class:changed-binding={typecastToDirection(direction) ===
              directionBeingChanged}
            on:click={() => {
              directionBeingChanged = typecastToDirection(direction);
            }}
          >
            {directionBeingChanged === typecastToDirection(direction)
              ? ""
              : $bindings[direction][0].toUpperCase()}
          </button>
        {/each}
      </div>
      {#if directionBeingChanged !== ""}
        <p in:fly class="rebinding-instruction">
          Bind to new key by pressing a key of your choice. Press escape to
          cancel.
        </p>
      {/if}
    </div>
  {:else}
    <h3 class="section-title no-settings-text">No settings available</h3>
  {/if}
</main>

<svelte:window on:keydown={handleKeydown} />

<style>
  main {
    align-items: center;
    background-color: rgb(var(--primary-color));
    border-radius: var(--button-radius);
    box-sizing: border-box;
    /* border: solid 2px white; */
    color: rgb(var(--text-on-primary-element-color));
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: flex-start;
    padding: 0.5em 1em;
    width: 100%;
    max-width: 300px;
    min-height: 100px;
  }

  .no-settings-main {
    justify-content: center;
  }

  .title {
    display: inline-block;
    padding-bottom: 0.25em;
    font-size: 1.5em;
    font-weight: 600;
    text-align: center;
    border-bottom: solid 2px rgb(var(--text-on-primary-element-color));
  }

  .log-button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    color: rgb(var(--text-on-primary-element-color));
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .key-binding-container {
    align-items: center;
    padding-bottom: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    width: 100%;
  }

  .key-button-container {
    column-gap: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    margin-bottom: 0.25em;
    row-gap: 10px;
    /* width: 100%; */
    /* border: solid 1px black; */
  }

  .section-title {
    align-self: flex-start;
    font-size: 1em;
  }

  .no-settings-text {
    align-self: center;
  }

  .control-button {
    aspect-ratio: 1/1;
    background-color: rgb(var(--text-on-primary-element-color));
    border: none;
    border-radius: 10px;
    color: rgb(var(--primary-color));
    font-size: 1em;
    font-weight: 600;
    margin: 0;
    padding: 0.25em;
    width: 40px;
  }

  #up {
    grid-column: 2/3;
    grid-row: 1/2;
  }

  #down {
    grid-column: 2/3;
    grid-row: 2/3;
  }

  #right {
    grid-column: 3/4;
    grid-row: 2/3;
  }

  #left {
    grid-column: 1/2;
    grid-row: 2/3;
  }

  .rebinding-instruction {
    font-weight: 500;
  }
</style>
