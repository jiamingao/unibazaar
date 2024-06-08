import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsThunk } from "../../redux/product";
import { useNavigate } from "react-router-dom";
import './LandingPage.css'

function LandingPage(){
  const dispatch = useDispatch();
  const navigate = useNavigate()

  let productsObj = useSelector((state)=>state.products.allProducts)
  // console.log("~~~~~~~~~~~~~~~~~productObj", productsObj)

  // const productsArr = Object.values(productsObj)
  const productsArr = productsObj ? Object.values(productsObj) : [];
  //  console.log("~~~~~~~~~~~~~~~~~productArr", productsArr)

  useEffect(()=>{
    dispatch(getAllProductsThunk())
  }, [dispatch])


  return(
    <div className="products">
      {productsArr.length > 0 ? (
      <div className="product-container">
        {productsArr.map((product) => (
          <div onClick={()=>navigate(`/products/${product.id}`)} key={product.id} className="product">
            <img src={product.images[0].image_url} alt={product.name} className="product-image" />
            <p className="price-container">
              <span className="badge-container">
                  <span className="price-value">${product.price}</span>
              </span>
             </p>
          </div>
        ))}
      </div>
    ) : (
      <div className="loading-container">
        <h3>loading....</h3>
      </div>
    )}
    </div>
  )
}


export default LandingPage;
