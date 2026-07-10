import {
useNavigate
} from "react-router-dom";


export default function Login(){

const navigate=useNavigate();


function login(){

navigate("/dashboard")

}


return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
">


<div className="
bg-white
shadow-xl
rounded-xl
p-8
w-96
">


<h1 className="
text-3xl
font-bold
text-blue-700
text-center
">
EduScale
</h1>


<p className="
text-center
text-gray-500
mb-6
">
School Management System
</p>


<input
className="
w-full
border
rounded-lg
p-3
mb-3
"
placeholder="Email"
/>


<input
className="
w-full
border
rounded-lg
p-3
mb-5
"
placeholder="Password"
type="password"
/>


<button
onClick={login}
className="
w-full
bg-blue-700
text-white
p-3
rounded-lg
hover:bg-blue-800
"
>
LOGIN
</button>


</div>


</div>


)

}