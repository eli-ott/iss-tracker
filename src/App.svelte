<script>
  import { onMount } from "svelte";
  import { createScene, focusOnIss } from "./scene";
  import getIssPosition from "./getCoordinates";

  let canvas;

  let latitude;
  let longitude;
  const getPosition = () => {
    getIssPosition().then((value) => {
      latitude = value.latitude;
      longitude = value.longitude;
    });
  };
  getPosition();
  setInterval(getPosition, 2500);

  onMount(() => {
    createScene(canvas);
  });

  let showInfo = true;
  const toggleInfo = () => {
    showInfo = !showInfo;
  };
</script>

<main>
  {#if !showInfo}
    <button style="position: absolute; z-index: 100; top: 10px; left: 10px;" on:click={toggleInfo}>Show Informations</button>
  {/if}
  {#if showInfo}
    <div class="info">
      <h1>Real-time ISS tracker</h1>
      <p>
        Current position of the ISS: <br /> <br />
        <u>Latitude</u>
        {latitude} <br />
        <u>Longitude:</u>
        {longitude}
      </p>
      <p class="disclaimer">
        Please note that there is some uncertainty in the position
      </p>
      <button on:click={focusOnIss}>Focus on the ISS</button>
      <button on:click={toggleInfo}>Hide Informations</button>
    </div>
  {/if}
  <canvas bind:this={canvas} />
  <div class="credits">
    <p>
      This project was created by <a href="https://github.com/eli-ott"
        >eli-ott</a
      >.
    </p>
    <p>
      The API used comes from <a
        href="http://open-notify.org/Open-Notify-API/ISS-Location-Now/"
        >Open-notify API</a
      >.
    </p>
  </div>
</main>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  div {
    position: absolute;

    font-family: monospace;
    font-size: 15px;

    z-index: 100;
    padding: 15px;

    backdrop-filter: brightness(50%);
    color: white;
  }
  .info {
    top: 0;
    left: 0;
  }
  .info > h1 {
    margin-bottom: 10px;
  }
  button {
    cursor: pointer;

    margin: 10px  5px 10px 0;
    padding: 10px;
    transition: 0.15s;

    color: #fff;
    background: none;
    border: solid 1px #fff;
  }
  button:hover {
    background: #fff;
    color: #000;
  }
  .credits {
    right: 0;
    top: 0;
  }
  .disclaimer {
    font-size: 13px;
    margin-top: 10px;
    text-decoration: underline 1px #fff;
  }
  a {
    color: #fff;
    font-style: italic;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline 1px #fff;
  }
  @media screen and (max-width: 800px) {
    div {
      font-size: 13px;
      width: 100vw;
    }
    .credits {
      height: 7.5vh;
      top: 92.5vh;
    }
  }
</style>
