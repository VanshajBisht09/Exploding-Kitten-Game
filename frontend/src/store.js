import { createStore } from 'redux';

const initialState = {
  deck: [],
  drawnCards: [],
  drawnCard: null,
  username: '',
  usernameValid: false,
  gameStatus: 'not_started', // 'playing', 'won', 'lost'
  defuseCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        deck: action.payload.deck,
        gameStatus: 'playing',
        drawnCard: null,
        drawnCards: [],
        defuseCount: 0,
      };
    case 'DRAW_CARD':
      return {
        ...state,
        drawnCard: action.payload.card,
        drawnCards: [...state.drawnCards, action.payload.card],
        deck: state.deck.filter((_, i) => i !== action.payload.index),
      };
    case 'SHUFFLE_DECK':
      return {
        ...state,
        deck: action.payload.deck,
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
        usernameValid: action.payload.trim().length > 0,
      };
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload,
      };
    case 'INCREMENT_DEFUSE':
      return {
        ...state,
        defuseCount: state.defuseCount + 1,
      };
    case 'DECREMENT_DEFUSE':
      return {
        ...state,
        defuseCount: Math.max(state.defuseCount - 1, 0),
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;