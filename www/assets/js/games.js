function render(state) {
  const { games, gamesDone } = state;

  const container = document.getElementById("main");

  const newElements = games.map(game => {
    const gameContainer = document.createElement("div");
    gameContainer.classList.add("game-container");
    if (gamesDone.includes(game)) {
      gameContainer.classList.add("done");
    }
    gameContainer.innerText = game;
    return gameContainer;
  });

  container.innerHTML = "";
  container.append(...newElements);
}

function main() {
  console.log("init");

  const websocket = new Connect()
  const config = {
    onMessage:  (ev) => {
      const { type, data } = JSON.parse(ev.data)
      console.log("onMessage", { type, data });

      if (type === 'stateUpdate') {
        render(data);
      }
    }
  }

  websocket.start(config);

  document.addEventListener('websocketConnectionReady', () => websocket.sendMessage("getState"));

  setInterval(() => {
    console.log("DEBUG - interval", websocket.connection_status);
    if (!websocket || !websocket.connection_status) {
      console.log("DEBUG - reconnecting");
      websocket.start(config);
    }
  }, 2000);
}

main();
