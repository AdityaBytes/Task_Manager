// reducers.js
const initialState = {
    // Define your initial state here
    counter: 0,
  };
  
  function rootReducer(state = initialState, action) {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, counter: state.counter + 1 };
      case 'DECREMENT':
        return { ...state, counter: state.counter - 1 };
      default:
        return state;
    }
  }
  
  export default rootReducer;
  