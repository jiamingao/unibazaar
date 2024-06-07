import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../redux/review";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from '../../context/Modal'

const CreateReview=({product, setReviewPosted})=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal()

  const [review, setReview]=useState('')
  const [rating, setRating]=useState(null)
  const [hover, setHover]=useState(null)
  const [error, setError] = useState({})

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData = new FormData()
    formData.append('review', review)
    formData.append('rating', rating)
    // console.log(Array.from(formData))

    try{
      await dispatch(createReviewThunk(formData, product.id)).then(() => {
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

export default CreateReview
