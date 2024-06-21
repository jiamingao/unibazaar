//actions
const ADD_ITEM = 'cart/ADD_ITEM';
const GET_ALL_ITEMS = 'cart/GET_ITEM';
const REMOVE_ITEM = 'cart/REMOVE_ITEM';
const UPDATE_COUNT = 'cart/UPDATE_COUNT';
const RESET = 'cart/RESET';

//action creators
export const reset = () => {
  return {
    type: RESET
  };
};

const addItem = (item) => {
  return {
    type: ADD_ITEM,
    payload: item
  };
};

const getAllItems = (items)=>({
  type: GET_ALL_ITEMS,
  payload: items
});

const updateCount=(item)=>{
  return {
    type: UPDATE_COUNT,
    payload: item

  }
}

const removeItem = (itemId) => {
  return {
    type: REMOVE_ITEM,
    itemId
  };
};

//thunks
export const removeItemThunk=(itemId)=>async(dispatch)=>{
  const res = await fetch(`/api/cart/${itemId}/delete`,{
    method: "DELETE",
  })

  if(res.ok){
    // const data = await res.json();
    // console.log("remove thunk~~~", itemId)
    dispatch(removeItem(itemId))
  }else{
    const error = await res.text();
    console.error('Failed to remove item:', error);
    return { error };
  }


}


export const updateCountThunk=(productId,quantity)=>async(dispatch)=>{
  const res = await fetch(`/api/cart/${productId}/edit`,{
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_id: productId, quantity:quantity })
  })

  if(res.ok){
    const data = await res.json();
    dispatch(updateCount(data))
    return data
  }else{
    const error = await res.text();
    console.error('Failed to update item:', error);
    return { error };
  }

}


export const addItemThunk=(productId, quantity=1)=>async(dispatch)=>{
  const res = await fetch("/api/cart/add",{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_id: productId, quantity })
  })

  if(res.ok){
    const data = await res.json();
    // console.log("thunk line 44",data)
    dispatch(addItem(data))
    return data
  }else{
    const error = await res.text();
    console.error('Failed to add item:', error);
    return { error };
  }
}

export const getAllItemsThunk=()=>async(dispatch)=>{
  const res = await fetch("/api/cart/all");

  if(res.ok){
    const data = await res.json();
    dispatch(getAllItems(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

//reducers

const initialState ={
  items: {},
  order: []
}

function cartReducer(state=initialState, action){
  let newState;
  switch(action.type){
    case GET_ALL_ITEMS:{
      newState = { ...state, items: action.payload};
      return newState;
    }
    case ADD_ITEM:{
      const { id } = action.payload
      newState = {...state};
        newState.items = {
          ...state.items,
          [action.payload.id]:{...action.payload}
        };
        newState.order = [...newState.order, id];

      return newState;
    }
    case UPDATE_COUNT: {
      // console.log('Current state before update:', state);
      const { id } = action.payload;
      const updatedItem = {
        ...state.items[id],
        ...action.payload
      };

      const updatedItems = {
        ...state.items,
        [id]: updatedItem
      };

      newState = {
        ...state,
        items: updatedItems
      };

      // console.log('New state after update:', newState);
      return newState;
    }
    case REMOVE_ITEM:{
      // console.log('Current state before deletion:', state);
      const itemId = action.itemId;
      newState = {...state};
      // console.log('Deleting item with ID:', itemId);
      delete newState.items[itemId];
      newState.order = newState.order.filter(id => id !== itemId)
      // console.log('New state after deletion:', newState);
      return newState

    }
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export default cartReducer;
