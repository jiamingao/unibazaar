import {useEffect,useState} from 'react'
import {useSelector, useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom"
import { createProductThunk, getAllProductsThunk } from '../../redux/product'


const CreateProduct=()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [return_accepted, setReturnAccepted] = useState(false)
  const [image_url, setImageUrl] = useState(null)
  const [error, setError] = useState({})

  const currUser = useSelector(state=>state.session.user)

  useEffect(()=>{
    if(!currUser) navigate('/')
  }, [navigate, currUser])

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData = new FormData()

    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('return_accepted', return_accepted)
    formData.append('image_url', image_url)

    // console.log(Array.from(formData))

    try{
      const product = await dispatch(createProductThunk(formData))
      console.log(product.id)
      //change it to product detail later
      await dispatch(getAllProductsThunk())
      navigate(`/`)
    }catch(error){
      console.error("creating product error:", error);
    }

  }

  useEffect(() => {
    const errorObj = {}

    if(!name.length) errorObj.name = "Name is Required"
    if(!price.length) errorObj.price = "Price is Required"
    if(!description.length) errorObj.description = "Description is Required"
    setError(errorObj)

}, [name,price,description])

  return(
    <div className='create-product-container'>
    <h1 className='cp-title'>Add a New Product</h1>
      <form className='cp-form' onSubmit={handleSubmit}>
          <div className='cp-inputs'>

            <div className='cp-name'>
            <label className='cp-label'>Name:</label>
              <input
              type="text"
              name="name" placeholder='product name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="error-container">
              {error.name && <p className='error-msg'>{error.name}</p>}
            </div>

            <div className='cp-price'>
            <label className='cp-label'>Price:</label>
              <input
              type="text"
              name="price" placeholder='product price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="error-container">
              {error.price && <p className='error-msg'>{error.price}</p>}
            </div>

            <div className='cp-description'>
            <label className='cp-label'>
            <p>Describe Your Product:</p>
            </label>
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please write at least 30 characters"
              />
            </div>
            <div className="error-container">
              {error.description && <p className='error-msg'>{error.description}</p>}
            </div>

            <div className='cp-category'>
            <label className='cp-label'>Category:</label>
            <select
                id="category"
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">Select a Category</option>
                <option value="Clothing">Clothing</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Craft Supplies">Craft Supplies</option>
            </select>
            </div>

            <div className='cp-return'>
            <label className='cp-label'>Return Accepted?</label>
              <input
              type="checkbox"
              name="return_accepted"
              checked={return_accepted}
              onChange={(e) => setReturnAccepted(e.target.checked)}
              />
            </div>

            <div className='cp-image'>
            <label className='cp-label'>Image:</label>
            <input
                type="file"
                name="image_url"
                required
                onChange={(e) => setImageUrl(e.target.files[0])}
            />
            </div>

          <div className='cp-submit'>
          <button type="submit" disabled={Object.values(error).length > 0} className='cp-submit-btn'>Submit</button>
          </div>
      </div>
      </form>
  </div>
  )


}


export default CreateProduct;
