let state;
loadState();

const connection = new Connect()

document.addEventListener('DOMContentLoaded', () => {
  connection.start({
    container: document.querySelector('.window .title'),
    onMessage: ev => {
      const { type, data } = JSON.parse(ev.data)
      console.log("onMessage", { type, data });
      if (type === 'getState') {
        if (!state) {
          loadState();
        }
        connection.sendMessage("stateUpdate", state)
      }
    }
  })

  loadInputState();
  renderGames();

  document.querySelector('#gamesInput').addEventListener('change', (ev) => {
    const games = ev.target.value
      .split(' ')
      .map(game => game.trim())
      .filter(game => game.length)

    updateState({ games, gamesOriginal: [...games] })
    console.log("games change", state)
    renderGames()
  });

  document.querySelector('#nextButton').addEventListener('click', (ev) => {
    ev.preventDefault()

    const lastDone = state.gamesDone[state.gamesDone.length - 1]
    const lastDoneIndex = state.games.indexOf(lastDone)
    if (lastDoneIndex >= state.games.length - 1) {
      return
    }

    const gamesDone = [...state.gamesDone, state.games[lastDoneIndex + 1]]
    updateState({ gamesDone })
    renderGames()
  });

  document.querySelector('#backButton').addEventListener('click', (ev) => {
    ev.preventDefault()

    if (!state.gamesDone.length) {
      return
    }

    const gamesDone = state.gamesDone.slice(0, state.gamesDone.length - 1)
    updateState({ gamesDone })
    renderGames()
  })

  document.querySelector("#randomButton").addEventListener("click", (ev) => {
    ev.preventDefault();

    const games = shuffleArray(state.games);
    updateState({ games, gamesDone: [] });
    loadInputState();
    renderGames();
  });
  
  document.querySelector("#resetButton").addEventListener("click", (ev) => {
    ev.preventDefault();

    updateState({ games: [...state.gamesOriginal], gamesDone: [] });
    loadInputState();
    renderGames();
  });
})

function renderGames() {
  const elements = state.games.map(game => {
    const div = document.createElement('div')
    div.classList.add('game')
    if (state.gamesDone.includes(game)) {
      div.classList.add('done')
    }
    div.innerText = game
    return div
  })

  const container = document.querySelector('#gamesContainer')
  container.innerHTML = ''
  elements.forEach(element => container.appendChild(element))
}

function updateState(partialState) {
  state = {
    ...state,
    ...partialState
  }
  localStorage.setItem('state', JSON.stringify(state))
  connection.sendMessage("stateUpdate", state)
  console.log('updated state', state)
}

function loadState() {
  const rawState = localStorage.getItem('state')
  if (!rawState) {
    state = {
      gamesOriginal: [],
      games: [],
      gamesDone: [],
    }
  } else {
    state = JSON.parse(rawState)
  }

  console.log('loaded state', state)
}

function loadInputState() {
  const input = document.querySelector('#gamesInput')
  input.value = state.games.join(' ')
}

function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }

  return array;
}