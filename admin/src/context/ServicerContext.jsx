import { createContext } from "react";

export const ServicerContext  = createContext()

const ServicerContextProvider = (props) =>{
 const value = {

 }
 return(
    <ServicerContext.Provider value={value}>
        {props.children}
    </ServicerContext.Provider>
 )
}

export default ServicerContextProvider