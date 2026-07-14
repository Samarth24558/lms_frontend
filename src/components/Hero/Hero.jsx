import "./Hero.css";

import { motion } from "framer-motion";

import {

FaPlayCircle,

FaUsers,

FaBookOpen,

FaAward

}

from "react-icons/fa";

export default function Hero(){

return(

<section className="hero">

<div className="hero-left">

<motion.h1

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

transition={{duration:.8}}

>

Learn

Anything

Anywhere

Anytime

</motion.h1>

<p>

Master MERN Stack, AI, Python,

Java, Cloud Computing and

become job ready.

</p>

<div className="hero-buttons">

<button>

Start Learning

</button>

<button className="outline">

<FaPlayCircle/>

Watch Demo

</button>

</div>

<div className="hero-stats">

<div>

<FaUsers/>

<h3>

20K+

</h3>

<p>

Students

</p>

</div>

<div>

<FaBookOpen/>

<h3>

100+

</h3>

<p>

Courses

</p>

</div>

<div>

<FaAward/>

<h3>

15K+

</h3>

<p>

Certificates

</p>

</div>

</div>

</div>

<div className="hero-right">

<div className="circle"></div>

<img

src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"

alt="hero"

/>

<div className="floating one">

React

</div>

<div className="floating two">

AI

</div>

<div className="floating three">

MERN

</div>

</div>

</section>

);

}