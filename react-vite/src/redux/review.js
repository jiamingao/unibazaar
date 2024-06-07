//actions
const LOAD_REVIEWS = "products/LOAD_REVIEWS";
const CREATE_REVIEW = "products/CREATE_REVIEW";
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW"

//action creators
const getReviews = (reviews)=>({
  type: LOAD_REVIEWS,
  payload: reviews
});

const createReview=(review)=>({
  type: CREATE_REVIEW,
  payload: review
})

const updateReview=(review)=>({
  type: UPDATE_REVIEW,
  payload: review

})

const deleteReview=(reviewId)=>({
  type: DELETE_REVIEW,
  payload: reviewId
})

//thunks
export const getReviewsThunk=(productId)=>async(dispatch)=>{
  const res = await fetch(`/api/products/${productId}/reviews`);

  if(res.ok){
    const data = await res.json();
    dispatch(getReviews(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

export const createReviewThunk=(review,productId)=>async(dispatch)=>{
  const res = await fetch(`/api/products/${productId}/reviews/new`,{
    method: "POST",
    body: review,
  })
  if(res.ok){
    const data = await res.json();
    dispatch(createReview(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

export const updateReviewThunk=(review,reviewId)=>async(dispatch)=>{
  const res = await fetch(`/api/reviews/${reviewId}/edit`,{
    method: "PUT",
    body: review,
  })

  if(res.ok){
    const data = await res.json();
    dispatch(updateReview(data))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

export const deleteReviewThunk=(reviewId)=>async(dispatch)=>{
  const res = await fetch(`/api/reviews/${reviewId}/delete`,{
    method: "DELETE",
  })

  if(res.ok){
    const data = await res.json();
    dispatch(deleteReview(reviewId))
    return data
  }else{
    const errors= await res.json();
    return {errors}
  }
}

//reducers
const initialState ={
  allReviews:{}
}

function reviewReducer(state=initialState, action){
  let newState;
  switch(action.type){
    case LOAD_REVIEWS:{
      newState = { ...state, allReviews: action.payload};
      return newState;
    }
    case CREATE_REVIEW:{
      newState = {...state};
      newState.allReviews={
        ...newState.allReviews,
        [action.payload.id]:{...action.payload}
      };
      return newState
    }
    case UPDATE_REVIEW:{
      newState={...state}
      newState.allReviews[action.payload.id]=action.payload
      return newState
    }
    case DELETE_REVIEW:{
      newState={...state}
      delete newState.allReviews[action.payload]
      return newState
    }
    default:
      return state;
  }
}


export default reviewReducer;
