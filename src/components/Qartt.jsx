import React, { useContext } from 'react';
import { UserContext } from '../UserContextProvider';

export default function Qartt() {
    const { foodname} = useContext(UserContext);
    console.log(foodname);
    console.log("cart");

    // Check if foodname is not an array
    if (!Array.isArray(foodname)) {
        return (
            <div>
                <h1>Cart</h1>
                <p>No items in the cart</p>
            </div>
        );
    }

    return (
        <>
        <div className='cart'>
            <h1>Cart</h1>
            <ul>
                {foodname.map((item, index) => (
                    <>
                    <li key={index}>{item.description}</li>
                    <li key={index}>{item.price}</li>
                    </>
                ))}
            </ul>
        </div>
        </>
    );
}
