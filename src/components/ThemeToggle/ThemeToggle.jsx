import {useState,useEffect} from "react";
import {FaMoon,FaSun} from "react-icons/fa";
import "./ThemeToggle.css";

export default function ThemeToggle(){

const[dark,setDark]=useState(true);

useEffect(()=>{

document.body.className=dark?"dark":"light";

},[dark]);

return(

<button

className="theme-toggle"

onClick={()=>setDark(!dark)}

>

{

dark?

<FaSun/>

:

<FaMoon/>

}

</button>

);

}