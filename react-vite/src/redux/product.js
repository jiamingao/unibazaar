//action
const LOAD_ALL_PRODUCTS = "products/LOAD_PRODUCTS";

//action creator
const getAllProducts = (products)=>({
  type: LOAD_ALL_PRODUCTS,
  payload: products
})


//thunk
export const getAllProductsThunk=()=>async(dispatch)=>{
  const res = await fetch("api/products/all");

  if(res.ok){
    const data = await res.json();
    // console.log("~~~~~~~~productsthunk", data)
    dispatch(getAllProducts(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}


//reducer
const initialState ={
  allProducts:{}
}

function productReducer(state=initialState, action){
  let newState;
  switch(action.type){
    case LOAD_ALL_PRODUCTS:{
      newState = { ...state, allProducts: action.payload};
      return newState;
      // action.payload.forEach((product)=>{
      //   allProducts[product.id]=product
      // })
      // return {...state, allProducts}
    }
    default:
      return state;
  }
}


export default productReducer;
