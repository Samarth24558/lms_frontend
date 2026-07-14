import {useEffect,useState} from "react";
import {FaArrowUp} from "react-icons/fa";
import "./ScrollTop.css";

export default function ScrollTop(){

const[show,setShow]=useState(false);

useEffect(()=>{

window.addEventListener("scroll",()=>{

setShow(window.scrollY>400);

});

},[]);

return(

show&&

<button

className="scroll-top"

onClick={()=>window.scrollTo({

top:0,

behavior:"smooth"

})}

>

<FaArrowUp/>

</button>

);

}