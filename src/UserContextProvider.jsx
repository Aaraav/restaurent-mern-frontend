import React, { useState } from 'react';
import { createContext } from 'react';

export const UserContext=createContext(null);


export function UserContextProvider({ children }) {
  const [foodname, setfoodname] = useState([]);
  const [val,setval]=useState(0);
  const [total,settotal]=useState(0);
  const [clients,setclients]=useState();
const age=28;
  return (
    <UserContext.Provider value={{ foodname, setfoodname,age,val,setval,total,settotal,clients,setclients}}>
      {children}
    </UserContext.Provider>
  );
}
