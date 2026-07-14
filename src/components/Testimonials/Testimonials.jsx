import "./Testimonials.css";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const testimonials = [

{
name:"John Smith",
role:"Frontend Developer",
image:"https://i.pravatar.cc/150?img=12",
text:"The MERN course completely changed my career. Everything was explained clearly and professionally.",
rating:5
},

{
name:"Sarah Johnson",
role:"Software Engineer",
image:"https://i.pravatar.cc/150?img=32",
text:"The best learning platform I've used. Beautiful interface and high quality content.",
rating:5
},

{
name:"David Wilson",
role:"AI Engineer",
image:"https://i.pravatar.cc/150?img=53",
text:"Excellent instructors and practical projects helped me land my first developer job.",
rating:5
}

];

export default function Testimonials(){

return(

<section className="testimonials">

<div className="section-title">

<h2>

What Our Students Say

</h2>

<p>

Trusted by thousands of learners worldwide.

</p>

</div>

<div className="testimonial-grid">

{

testimonials.map((item,index)=>(

<motion.div

key={index}

className="testimonial-card"

whileHover={{y:-10}}

>

<img
src={item.image}
alt={item.name}
/>

<h3>

{item.name}

</h3>

<span>

{item.role}

</span>

<div className="stars">

{

[...Array(item.rating)].map((_,i)=>

<FaStar key={i}/>

)

}

</div>

<p>

"{item.text}"

</p>

</motion.div>

))

}

</div>

</section>

);

}