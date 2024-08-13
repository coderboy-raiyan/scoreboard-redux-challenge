import { createStore } from "redux";

const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".lws-addMatch");

const initialState = {
  matchList: [],
};

function generateId() {
  const matches = store.getState().matchList;
  if (matches.length) {
    return Math.max(...matches.map((match) => parseInt(match.id))) + 1;
  }
  return matches.length + 1;
}

function generateMatch(matchId, matchResult, incrementVal, decrementVal) {
  return `
  <div data-id='${matchId}' class="match">
            <div class="wrapper">
              <button class="lws-delete">
                <img src="./image/delete.svg" alt="">
              </button>
              <h3 class="lws-matchName">Match ${matchId}</h3>
            </div>
            <div class="inc-dec">
              <form class="incrementForm">
                <h4>Increment</h4>
                <input type="number" value='${incrementVal}' name="increment" class="lws-increment">
              </form>
              <form class="decrementForm">
                <h4>Decrement</h4>
                <input type="number" value='${decrementVal}' name="decrement" class="lws-decrement">
              </form>
            </div>
            <div class="numbers">
              <h2 class="lws-singleResult">${matchResult}</h2>
            </div>
          </div>
  `;
}

const matchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MATCH":
      return {
        ...state,
        matchList: [...state.matchList, action.payload],
      };

    case "FIND_AND_CHANGE_RESULT":
      const findMatch = state.matchList.find(
        (m) => m.id.toString() === action?.payload.id
      );

      findMatch.element = action.payload.element;
      return state;

    case "DELETE_MATCH":
      return {
        ...state,
        matchList: state.matchList.filter(
          (m) => m.id.toString() !== action?.payload.id.toString()
        ),
      };

    case "RESET":
      return {
        ...state,
        matchList: [],
      };
    default:
      return state;
  }
};

const store = createStore(matchReducer);

function renderUI() {
  let div = "";
  store.getState().matchList.forEach((match) => {
    div += match.element;
  });
  matchContainer.innerHTML = div;

  const matches = Array.from(matchContainer.children);

  const totalEl = document.querySelector(".total");

  const totalSum = matches.reduce((prev, curr) => {
    return parseInt(curr.querySelector(".lws-singleResult").innerHTML) + prev;
  }, 0);

  totalEl.innerHTML = `TOTAL : ${totalSum}`;

  matches.forEach((match) => {
    const incrementInput = match.querySelector(".lws-increment");
    const decrementInput = match.querySelector(".lws-decrement");
    const deleteBtn = match.querySelector(".lws-delete");
    const resultEle = match.querySelector(".lws-singleResult");
    const inform = match.querySelector(".incrementForm");
    const deform = match.querySelector(".decrementForm");

    inform.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    deform.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    incrementInput.addEventListener("keyup", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        store.dispatch({
          type: "FIND_AND_CHANGE_RESULT",
          payload: {
            id: match.dataset.id,
            element: generateMatch(
              match.dataset.id,
              Number(incrementInput.value) + parseInt(resultEle.innerHTML),
              incrementInput.value,
              decrementInput.value
            ),
          },
        });
      }
    });

    decrementInput.addEventListener("keyup", (e) => {
      e.stopPropagation();
      const result = parseInt(resultEle.innerHTML);
      if (result === 0 || result < Number(decrementInput.value)) {
        return;
      }
      e.stopPropagation();
      if (e.key === "Enter") {
        store.dispatch({
          type: "FIND_AND_CHANGE_RESULT",
          payload: {
            id: match.dataset.id,
            element: generateMatch(
              match.dataset.id,
              parseInt(resultEle.innerHTML) - Number(decrementInput.value),
              incrementInput.value,
              decrementInput.value
            ),
          },
        });
      }
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      store.dispatch({
        type: "DELETE_MATCH",
        payload: { id: match.dataset.id },
      });
    });
  });
}

addMatchBtn.addEventListener("click", () => {
  store.dispatch({
    type: "ADD_MATCH",
    payload: {
      id: generateId(),
      element: generateMatch(generateId(), 0, 0, 0),
    },
  });
});

document.querySelector(".lws-reset").addEventListener("click", () => {
  store.dispatch({ type: "RESET" });
  store.dispatch({
    type: "ADD_MATCH",
    payload: {
      id: generateId(),
      element: generateMatch(generateId(), 0, 0, 0),
    },
  });
});

store.subscribe(renderUI);
store.subscribe(generateId);
store.dispatch({
  type: "ADD_MATCH",
  payload: {
    id: generateId(),
    element: generateMatch(generateId(), 0, 0, 0),
  },
});
