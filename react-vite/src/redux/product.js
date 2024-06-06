//actions
const LOAD_ALL_PRODUCTS = "products/LOAD_PRODUCTS";
const CREATE_PRODUCT = "products/CREATE_PRODUCT";
const LOAD_PRODUCTS_BY_USER = "products/LOAD_PRODUCTS_BY_USER";
const DELETE_PRODUCT = "products/DELETE_PRODUCT";
const UPDATE_PRODUCT = "products/UPDATE_PRODUCT";

//action creators
const getAllProducts = (products)=>({
  type: LOAD_ALL_PRODUCTS,
  payload: products
});

const createProduct = (product)=>({
  type: CREATE_PRODUCT,
  payload: product
});

const getProductsByUser = (products)=>({
  type: LOAD_PRODUCTS_BY_USER,
  payload: products
})

const deleteProduct=(productId)=>({
  type: DELETE_PRODUCT,
  payload: productId
})

const updateProduct=(product)=>({
  type: UPDATE_PRODUCT,
  payload: product
})

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

export const getProductsByUserThunk=()=>async(dispatch)=>{
  const res = await fetch("/api/products/current");

  if(res.ok){
    const data = await res.json();
    dispatch(getProductsByUser(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }

}

export const deleteProductThunk=(productId)=>async(dispatch)=>{
  const res = await fetch(`/api/products/${productId}/delete`,{
    method: "DELETE",
  })

  if(res.ok){
    const data = await res.json();
    dispatch(deleteProduct(productId))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }


}

export const updateProductThunk=(product,productId)=>async(dispatch)=>{
  const res = await fetch(`/api/products/${productId}/edit`,{
    method: "PUT",
    body: product,
  })

  if(res.ok){
    const data = await res.json();
    dispatch(updateProduct(data))
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
    case LOAD_PRODUCTS_BY_USER:{
      newState = {...state, myProducts: action.payload};
      return newState;
    }
    case DELETE_PRODUCT:{
      newState = {...state};
      delete newState.allProducts[action.payload];
      delete newState.myProducts[action.payload];
      return newState

    }
    case UPDATE_PRODUCT:{
      newState = {...state};
      newState.allProducts[action.payload.id]=action.payload;
      newState.myProducts[action.payload.id]=action.payload;
      return newState
    }
    default:
      return state;
  }
}


export default productReducer;
