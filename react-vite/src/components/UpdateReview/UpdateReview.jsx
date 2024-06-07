import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from '../../context/Modal';
import { updateReviewThunk } from "../../redux/review";
// import { useParams } from "react-router-dom";
// import { getReviewsThunk } from "../../redux/review";

const UpdateReview=({product, setReviewPosted, reviewId})=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal()


  const reviewsTotalObj = useSelector(state=>state.reviews.allReviews)
  const reviewsObj = reviewsTotalObj.reviews
  const selectedReview = reviewsObj[reviewId]
  // console.log("line17",reviewsTotalObj)
  // console.log("line18",reviewsObj)
  // console.log("line19",review)

  const [review, setReview]=useState(selectedReview?.review||'')
  const [rating, setRating]=useState(selectedReview?.rating||null)
  const [hover, setHover]=useState(null)
  const [error, setError] = useState({})

  useEffect(()=>{
    if(selectedReview){
      setReview(selectedReview.review || '')
      setRating(selectedReview.rating || null)
    }
  },[selectedReview])

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData = new FormData()
    formData.append('review', review)
    formData.append('rating', rating)
    // console.log(Array.from(formData))

    try{
      await dispatch(updateReviewThunk(formData, reviewId)).then(() => {
        setReviewPosted(true);
        closeModal();
      })
      navigate(`/products/${product.id}`)
    }catch(error){
      console.error("creating product error:", error);
    }

  }

  useEffect(() => {
    const errorObj = {}
    if(!review.length) errorObj.review = "review is Required"
    if(rating===null) errorObj.rating = "rating is Required"
    setError(errorObj)
}, [review,rating])

return(
  <div className="create-review-container">
    <form className='cr-form' onSubmit={handleSubmit}>
    <h2>How do you like this product?</h2>
    <textarea
        className="review-textarea"
        type='text'
        name='review'
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Leave your review here..."
      />
      <div className="error-container">
        {error.review && <p className='error-msg'>{error.review}</p>}
      </div>

      <div className='StarsBox'>
        {[1, 2, 3, 4, 5].map((satr, i) => {
          const ratingValue = i + 1
          return (
          <label key={i}>
            <span
            className='stars'
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            >
            {ratingValue <= (hover || rating) ? '★' : '☆'}
            </span>
            </label>
            )
            })}
          <label className='stars-label'>Stars</label>
            </div>
       <div className="error-container">
        {error.rating && <p className='error-msg'>{error.rating}</p>}
      </div>

      <button type="submit" disabled={!review.length || error.length > 0 || rating < 1}>
        Submit Review
      </button>

    </form>


  </div>
)

}


export default UpdateReview;
