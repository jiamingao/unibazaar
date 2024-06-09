import {useEffect,useState} from 'react'
import {useSelector, useDispatch} from "react-redux"
import {useFSModal} from '../../context/FullScreenModal'
import { useNavigate } from "react-router-dom"
import { updateProductThunk, getAllProductsThunk } from '../../redux/product'
import './UpdateProduct.css'


const UpdateProduct = ({product, setProductPosted})=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useFSModal();

  const [name, setName] = useState(product?.name||'');
  const [price, setPrice] = useState(product?.price||'');
  const [description, setDescription] = useState(product?.description||'');
  const [category, setCategory] = useState(product?.category||'');
  const [return_accepted, setReturnAccepted] = useState(product?.return_accepted||false)
  const [error, setError] = useState({})
  // const [showImages, setShowImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  // const [image_url, setImageUrl] = useState(product?.main_image[0].image_url ||null)
  // console.log('line 23', product)
  const [imageUrls, setImageUrls] = useState(product?.images.map(img => img.image_url) || [null, null, null, null, null]);
  const [newImages, setNewImages] = useState([null, null, null, null, null]);


  const currUser = useSelector(state=>state.session.user)

  useEffect(()=>{
    if(!currUser) navigate('/')
  }, [navigate, currUser])

  useEffect(()=>{
    if(product){
      setName(product.name || '')
      setPrice(product.price||'')
      setDescription(product.description ||'')
      setCategory(product.category || '')
      setReturnAccepted(product.return_accepted || false)
      setImageUrls(product.images.map(img => img.image_url) || [null, null, null, null, null])
    }
  },[product])

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageUrl(file);
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = () => {
//             setShowImage(reader.result);
//         };
//         reader.readAsDataURL(file);
//     }
// };

const handleFileChange = (file, index) => {
  const newImagesCopy = [...newImages];
  newImagesCopy[index] = file;
  setNewImages(newImagesCopy);

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrlsCopy = [...imageUrls];
      newImageUrlsCopy[index] = reader.result;
      setImageUrls(newImageUrlsCopy);
    };
    reader.readAsDataURL(file);
  }
};

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setImageLoading(true)
    const formData = new FormData()

    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('return_accepted', return_accepted)
    // formData.append('image_url', image_url)
    newImages.forEach((file, index) => {
      if (file !== null) {
        formData.append(`image_url_${index}`, file);
      }
    });

    // console.log(Array.from(formData))

    try{
      await dispatch(updateProductThunk(formData, product.id)).then(() => {
        setProductPosted(true);
        closeModal();
      })
      // console.log(product.id)
      await dispatch(getAllProductsThunk())
      navigate(`/products/${product.id}`)
      setImageLoading(false)
    }catch(error){
      console.error("creating product error:", error);
    }

  }

  useEffect(() => {
    const errorObj = {}

    // if(!name.length) errorObj.name = "Name is Required"
    // if(!price.length) errorObj.price = "Price is Required"
    // if(!description.length) errorObj.description = "Description is Required"
    // if(!image_url) errorObj.description = "Image is Required"
    if (!name.length) errorObj.name = "Required";

    if (!price.length) {
        errorObj.price = "Required";
    } else if (isNaN(price)) {
        errorObj.price = "Price must be a number";
    } else if (parseFloat(price) <= 0) {
        errorObj.price = "Price must be positive";
    }

    if (!description.length) errorObj.description = "Required";
    else if (description.length < 10) errorObj.description = "Please write at least 10 characters";

    setError(errorObj)

}, [name,price,description])

const isSubmitDisabled = Object.values(error).length > 0

  return(
    <div className='update-product-container'>
      <div className='up-form-box'>

      <form className='up-form' onSubmit={handleSubmit}>
      <div className='up-title'>Update Your Product</div>


            <div className='up-field'>
            <label className='up-label'>Name:{error.name && <p className='error-msg'>{error.name}</p>}</label>
              <input
              type="text"
              name="name" placeholder='product name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
            </div>


            <div className='up-field'>
            <label className='up-label'>Price:{error.price && <p className='error-msg'>{error.price}</p>}</label>
              <input
              type="text"
              name="price" placeholder='product price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              />
            </div>


            <div className='up-field'>
            <label className='up-label'>
            Describe Your Product:{error.description && <p className='error-msg'>{error.description}</p>}
            </label>
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please write at least 10 characters"
              />
            </div>


            <div className='up-field'>
            <label className='up-label'>Category:</label>
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

            <div className='up-return'>
            <label className='up-label'>Return Accepted?</label>
              <input
              type="checkbox"
              name="return_accepted"
              checked={return_accepted}
              onChange={(e) => setReturnAccepted(e.target.checked)}
              />
            </div>

            <div className='up-field'>
            <label className='up-label'>Image:</label>
            <div className='up-field-images'>
            {imageUrls.map((imageUrl, index) => (
  <div key={index} className='up-field'>
    <label className='up-label'>Image {index + 1}:</label>
    <input
      type="file"
      name={`image_url_${index}`}
      onChange={(e) => handleFileChange(e.target.files[0], index)}
    />
    {imageUrl && <img src={imageUrl} alt={`Preview ${index + 1}`} width="30" />}
  </div>
))}
            </div>
            </div>

          <div className='button-container'>
          <button className='up-submit-btn' type="submit" onClick={handleSubmit} disabled={isSubmitDisabled}>Confirm</button>
          <button className='cancel-button' onClick={closeModal}>Cancel</button>
          </div>

      </form>
      </div>
  </div>
  )

}

export default UpdateProduct;
