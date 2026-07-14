import "./Statistics.css";
import  CountUp  from "react-countup";
import { useInView } from "react-intersection-observer";
import {
FaBook,
FaUsers,
FaCertificate,
FaStar
} from "react-icons/fa";

const stats=[
{
icon:<FaBook/>,
end:120,
suffix:"+",
label:"Courses"
},
{
icon:<FaUsers/>,
end:25000,
suffix:"+",
label:"Students"
},
{
icon:<FaCertificate/>,
end:18000,
suffix:"+",
label:"Certificates"
},
{
icon:<FaStar/>,
end:4.9,
decimals:1,
label:"Rating"
}
];

export default function Statistics(){

const{ref,inView}=useInView({
triggerOnce:true
});

return(

<section
ref={ref}
className="statistics"
>

{

stats.map((item,index)=>(

<div
className="stat-card"
key={index}
>

<div className="icon">

{item.icon}

</div>

<h2>
  {item.end}
  {item.suffix}
</h2>

<p>

{item.label}

</p>

</div>

))

}

</section>

);

}