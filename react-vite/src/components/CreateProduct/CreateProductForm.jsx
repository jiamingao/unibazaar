import {useEffect,useState} from 'react'
import {useSelector, useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom"
import { createProductThunk, getAllProductsThunk } from '../../redux/product'
import './CreateProductForm.css'


const CreateProduct=()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [return_accepted, setReturnAccepted] = useState(false)
  const [error, setError] = useState({})
  // const [image_url, setImageUrl] = useState(null)

  const [imageUrls, setImageUrls] = useState([null, null, null, null, null])

  const handleImageChange = (file, index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = file;
    setImageUrls(newImageUrls);
  };

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
    // formData.append('image_url', image_url)

    imageUrls.forEach((file, index) => {
      if (file !== null) {
        formData.append(`image_url_${index}`, file);
      }
    });


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

    if (!name.length) errorObj.name = "Required";

    if (!price.length) {
        errorObj.price = "Required";
    } else if (isNaN(price)) {
        errorObj.price = "Price must be a number";
    } else if (parseFloat(price) <= 0) {
        errorObj.price = "Price must be positive";
    }

    if (!description.length) errorObj.description = "Required";
    else if (description.length < 30) errorObj.description = "Please write at least 30 characters";

    if (!imageUrls[0]) errorObj.imageUrls = "Please upload at least one picture to Image 1";

    setError(errorObj)

}, [name,price,description,imageUrls])


  return(

    <div className='create-product-container'>
      <div className='cp-form-box'>
      <form className='cp-form' onSubmit={handleSubmit}>
      <div className='cp-title'>Add a New Product</div>

            <div className='cp-field'>
            <label className='cp-label'>Name:{error.name && <p className='error-msg'>{error.name}</p>}</label>
              <input
              type="text"
              name="name" placeholder='product name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='cp-field'>
            <label className='cp-label'>Price:{error.price && <p className='error-msg'>{error.price}</p>}</label>
              <input
              type="text"
              name="price" placeholder='product price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className='cp-field'>
            <label className='cp-label'>Describe Your Product:{error.description && <p className='error-msg'>{error.description}</p>}</label>
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please write at least 30 characters"
              />
            </div>

            <div className='cp-field'>
            <label className='cp-label'>Category:</label>
            <select
                id="category"
                name="category"
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

            <div className='cp-field-return'>
            <label className='cp-label'>Return Accepted?</label>
              <input
              type="checkbox"
              name="return_accepted"
              checked={return_accepted}
              onChange={(e) => setReturnAccepted(e.target.checked)}
              />
            </div>

            <div className='cp-field'>
            <label className='cp-label'>Upload at least one image:{error.imageUrls && <p className='error-msg'>{error.imageUrls}</p>}</label>
              {imageUrls.map((_, index) => (
              <div key={index}>
                <label className='cp-label-images'>Image {index + 1}:</label>
                <input
                type="file"
                name={`image_url_${index}`}
                onChange={(e) => handleImageChange(e.target.files[0], index)}
                required={index === 0}
                />
                </div>
              ))}
              </div>

          <button type="submit" disabled={Object.values(error).length > 0} className='cp-submit-btn'>Submit</button>

      </form>
      </div>
  </div>

  )


}


export default CreateProduct;
