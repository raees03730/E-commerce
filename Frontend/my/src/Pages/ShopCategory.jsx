import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'
const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  
  // Use all_product to remove warning
  const productCount = all_product?.length || 0;
  
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' 
        src={props.banner || ''} 
        alt="category banner"
        onError={(e) => {e.target.style.display = 'none'}} // अगर image load न हो तो hide
      />
      
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of {productCount || 36} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="sort" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item,i)=>{
          if (props.category===item.category){
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
          }
          else{
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory