import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../redux/review";
import { getAllProductsThunk } from "../../redux/product";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import './ProductDetails.css'
import CreateReview from "../CreateReview/CreateReview";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdateReview from "../UpdateReview/UpdateReview";
import DeleteReview from "../DeleteReview/DeleteReview";

const ProductDetails=()=>{
  const dispatch = useDispatch();
  const {productId} = useParams();
  const [reviewPosted, setReviewPosted] = useState(false)

  const currUser = useSelector(state=>state.session.user)
  // console.log(currUser)

  const products = useSelector(state => state.products.allProducts)
  // console.log(products)

  const product = products[productId]
  // console.log(product)

  const reviewsTotalObj = useSelector(state=>state.reviews.allReviews)
  const reviewsObj = reviewsTotalObj.reviews
  const reviewsArr = reviewsObj? Object.values(reviewsObj) : []
  // console.log("line25",reviewsTotalObj)
  // console.log("line26",reviewsObj)
  // console.log("line27",reviewsArr)

  useEffect(()=>{

      dispatch(getAllProductsThunk())
      dispatch(getReviewsThunk(productId)).then(()=>{
        setReviewPosted(false)
      })

  }, [dispatch, productId,reviewPosted])

function isProductOwner(productOwnerId) {
    if (currUser && productOwnerId) {
      return currUser.id == productOwnerId
    }
    else
    {
      return null
    }
}

function formatDate(date) {
  const parsedDate = new Date(date);
  const options = {
    month: 'long',
    year: 'numeric'
  };
  const dateFormatter = new Intl.DateTimeFormat('default', options);
  return dateFormatter.format(parsedDate);
}

const buyBtn = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
};

const addCartBtn = (e) => {
  e.preventDefault();
  alert("Feature coming soon");
};

const addFavBtn = (e) => {
  e.preventDefault();
  alert("Feature coming soon");
};

return(
  <div className="product-details">
    {product ? (
      <div className="page-container">

      <div className="product-img-detail-container">
      <div className="product-img-container">
      <div className="other-img-container">
          {product.images.length > 1 && product.images.slice(1).map(image => (<img key={image.id} className="other-imgs" src={image.image_url} alt="other-images" />))}
        </div>
        <div className="main-img-conatainer">
        <img className="main-img" src={product.images.length > 0 ? product.images[0].image_url : 'default-image-url'} alt="main-image" />
        </div>
      </div>

      <div className="product-info-container">
        <div className="price-name-container">
            <p className="price">${product.price}</p>
            <p className="name">{product.name}</p>
        </div>

        <div className="btn-container">
        <button className='buy-btn' onClick={buyBtn}>Buy it now</button>
        <button className='add-cart-btn' onClick={addCartBtn}>Add to cart</button>
        <button className='add-fav-btn' onClick={addFavBtn}>Add to collection</button>
        </div>

        <div className="addtional-info-container">
          <p className="description">{product.description}</p>
          <div className="return">
            <p>accept return?</p>
              {product.return_accepted ? (
                <FaCheck color="green" />
              ) : (
                <ImCross color="red" />
              )}
            </div>
        </div>
        </div>
        </div>

        <div className="review-container">
          <div className="review-head">
          <p>★ {reviewsTotalObj.average_rating > 0 ? reviewsTotalObj.average_rating.toFixed(1) : 'New'}&nbsp;
        {reviewsArr.length > 0 ? ` · ${reviewsArr.length} ${reviewsArr.length === 1 ? 'Review' : 'Reviews'}` : ''}</p>
        {currUser && !isProductOwner(product.user_id) &&
      <div className='post-review'>
        <OpenModalButton
        className='review-btn'
        buttonText='Post Your Review'
        modalComponent={<CreateReview product={product} setReviewPosted={setReviewPosted} />} />
      </div>
    }
          </div>

          <div className="review-list">
            {
              reviewsArr.map(({id, poster, created_at, review, rating})=>(
                <div key={id}>
                  <div className="review-container">
                    {poster && <h2 className="name">{poster.firstname}</h2>}
                      <p className='date-month'>{formatDate(created_at)}</p>
                      <div>{rating}</div>
                      <p className='review-content'>{review}</p>
                  </div>
                  {currUser && currUser.id===poster.id &&
                   <div className='update-delete-review'>
                   <OpenModalButton
                    className='review-btn'
                    buttonText='update Your Review'
                    modalComponent={<UpdateReview product={product} setReviewPosted={setReviewPosted} reviewId={id} />} />
                    <OpenModalButton
                    className='review-btn'
                    buttonText='delete Your Review'
                    modalComponent={<DeleteReview setReviewPosted={setReviewPosted} reviewId={id} />} />
                  </div>}
               </div>
              ))
            }
          </div>


        </div>
      </div>

  ) : (
    <div className="loading-container">
      <h3>loading....</h3>
    </div>
  )}
  </div>
)
}


export default ProductDetails;
