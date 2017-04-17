import storage from 'common/storage';

const initState = {
  ...storage.getUser()
};

function user(state = initState, action) {
  if (action.type === 'UPDATE_USER') {
    const newState = {
      ...state,
      ...action.payload,
    };
    return newState;
  }

  return state;
}

module.exports = user;
