import { useDispatch} from 'react-redux'
import { useModal } from '../../context/Modal'
import {deleteProductThunk} from '../../redux/product'
import './DeleteProduct.css'


const DeleteProduct = ({product,setProductPosted}) =>{
    const dispatch=useDispatch()
    const { closeModal } = useModal()
    // const currUser = useSelector((state) => state.session.user)

    const handleDelete= (e)=>{
        e.preventDefault()
        dispatch(deleteProductThunk(product.id)).then(() => setProductPosted(true)).then(() => closeModal())

}
return (
    <div className='delete-modal-container'>
      <div className='text-container'>
        <h1 className='title-del'>Confirm Delete</h1>
        <p className='text-del'>Are you sure you want to delete this product?</p>
      </div>
      <div className='button-container'>
        <button className='delete-button' type="submit" onClick={handleDelete}>
          Yes, Delete product
        </button>
        <button className='cancel-button' onClick={closeModal}>
          No, Keep product
        </button>
      </div>
    </div>
  );
}
export default DeleteProduct
