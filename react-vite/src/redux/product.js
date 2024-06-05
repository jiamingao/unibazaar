//actions
const LOAD_ALL_PRODUCTS = "products/LOAD_PRODUCTS";
const CREATE_PRODUCT = "products/CREATE_PRODUCT";

//action creators
const getAllProducts = (products)=>({
  type: LOAD_ALL_PRODUCTS,
  payload: products
});

const createProduct = (product)=>({
  type: CREATE_PRODUCT,
  payload: product
});


//thunks
export const getAllProductsThunk=()=>async(dispatch)=>{
  const res = await fetch("/api/products/all");

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

export const createProductThunk=(product)=>async(dispatch)=>{
  const res = await fetch("/api/products/new",{
    method: "POST",
    body: product,
  })

  if(res.ok){
    const data = await res.json();
    dispatch(createProduct(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

//reducers
const initialState ={
  allProducts:{},
  myProducts:{}
}

function productReducer(state=initialState, action){
  let newState;
  switch(action.type){
    case LOAD_ALL_PRODUCTS:{
      newState = { ...state, allProducts: action.payload};
      return newState;
    }
    case CREATE_PRODUCT:{
      newState = {...state};
      newState.allProducts={
        ...newState.allProducts,
        [action.payload.id]:{...action.payload}
      };
      newState.myProducts={
        ...newState.myProducts,
        [action.payload.id]:{...action.payload}
      }
      return newState
    }
    default:
      return state;
  }
}


export default productReducer;
