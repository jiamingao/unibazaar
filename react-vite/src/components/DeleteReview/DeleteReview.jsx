import { useDispatch} from 'react-redux'
import { useModal } from '../../context/Modal'
import { deleteReviewThunk } from '../../redux/review'
import './DeleteReview.css'

const DeleteReview=({setReviewPosted, reviewId})=>{

  const dispatch=useDispatch()
  const { closeModal } = useModal()

  const handleDelete= (e)=>{
      e.preventDefault()
      dispatch(deleteReviewThunk(reviewId)).then(() => setReviewPosted(true)).then(() => closeModal())

}
return (
  <div className='delete-modal-container'>
    <div className='text-container'>
      <h1 className='title-del'>Confirm Delete</h1>
      <p className='text-del'>Are you sure you want to delete this review?</p>
    </div>
    <div className='button-container'>
      <button className='delete-button' type="submit" onClick={handleDelete}>
        Yes, Delete review
      </button>
      <button className='cancel-button' onClick={closeModal}>
        No, Keep review
      </button>
    </div>
  </div>
);

}

export default DeleteReview
