import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const Add_product = async () => {
    console.log(productDetails);
    
    if (!image) {
      alert("Please select an image");
      return;
    }

    let formData = new FormData();
    formData.append('product', image);

    try {
      // Upload image
      const uploadResponse = await fetch('https://e-commerce-backend-qe3u.onrender.com/upload', {
        method: 'POST',
        body: formData,  // Removed headers
      });
      
      const responseData = await uploadResponse.json();
      console.log("Upload response:", responseData);
      
      if (responseData.success) {
        // FIXED: Use 'image_url' (underscore) not 'image-url' (hyphen)
        const product = {
          ...productDetails,
          image: responseData.image_url  // ✅ Changed from 'image-url' to 'image_url'
        };
        
        console.log("Sending product to backend:", product);
        
        // Save product to database
        const addProductResponse = await fetch('https://e-commerce-backend-qe3u.onrender.com/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        
        const saveResult = await addProductResponse.json();
        
        if (saveResult.success) {
          alert("Product added successfully!");
          // Reset form
          setProductDetails({
            name: "",
            image: "",
            category: "women",
            new_price: "",
            old_price: ""
          });
          setImage(false);
        } else {
          alert("Failed to save product");
        }
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server. Make sure backend is running on port 4000");
    }
  }

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={Add_product} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
