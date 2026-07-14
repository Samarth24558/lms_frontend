import "./Features.css";
import { motion } from "framer-motion";

import {
FaInfinity,
FaCertificate,
FaLaptopCode,
FaUsers
} from "react-icons/fa";

const features = [

{
icon:<FaLaptopCode/>,
title:"Expert Instructors",
text:"Learn from experienced industry professionals."
},

{
icon:<FaInfinity/>,
title:"Lifetime Access",
text:"Watch your courses anytime without expiration."
},

{
icon:<FaCertificate/>,
title:"Free Certificate",
text:"Earn certificates after successfully completing courses."
},

{
icon:<FaUsers/>,
title:"Learning Community",
text:"Connect with thousands of students and mentors."
}

];

export default function Features(){

return(

<section className="features">

<div className="section-title">

<h2>

Why Choose LMS Pro?

</h2>

<p>

Everything you need to master new skills.

</p>

</div>

<div className="feature-grid">

{

features.map((item,index)=>(

<motion.div

key={index}

className="feature-card"

whileHover={{
scale:1.05,
y:-8
}}

>

<div className="feature-icon">

{item.icon}

</div>

<h3>

{item.title}

</h3>

<p>

{item.text}

</p>

</motion.div>

))

}

</div>

</section>

);

}