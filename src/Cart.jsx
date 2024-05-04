import React, { useContext } from 'react';
import { UserContext } from './UserContextProvider';

export default function Cart() {
    const { foodname, age } = useContext(UserContext);
    console.log(foodname,age);

    if (!Array.isArray(foodname) || foodname.length === 0) {
        return (
            <div>
                <h1>Cart</h1>
                <p>No items in the cart</p>
            </div>
        );
    }

    return (
        <div className='cart'>
            <h1 className='cart-text'>Cart</h1>
            <h1>{age}</h1>
            <ul>
                {foodname.map((item, index) => (
                    <li key={index}>
                        <h3>{item.description}</h3>
                        <p>{item.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
