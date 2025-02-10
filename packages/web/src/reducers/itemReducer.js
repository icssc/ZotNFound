export const initialItemState = {
  newAddedItem: {
    image: "",
    type: "",
    islost: true,
    name: "",
    description: "",
    itemdate: "",
    isresolved: false,
    ishelped: null,
  },
  isEdit: false,
  isCreate: true,
  position: [33.6461, -117.8427], // centerPosition
  focusLocation: null,
  uploadImg: "",
};

export const itemReducer = (state, action) => {
  switch (action.type) {
    case "SET_NEW_ITEM":
      return {
        ...state,
        newAddedItem: { ...state.newAddedItem, ...action.payload },
      };
    case "RESET_ITEM":
      return { ...state, ...initialItemState };
    case "TOGGLE_EDIT":
      return { ...state, isEdit: !state.isEdit };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "SET_FOCUS_LOCATION":
      return { ...state, focusLocation: action.payload };
    case "SET_UPLOAD_IMG":
      return { ...state, uploadImg: action.payload };
    default:
      return state;
  }
};
