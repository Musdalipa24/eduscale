import {
Home,
Users,
BookOpen,
ClipboardList,
Settings
}
from "lucide-react";


export default function Sidebar(){


return(

<div className="
w-64
bg-blue-900
text-white
min-h-screen
p-5
">


<h1 className="
text-2xl
font-bold
mb-8
">
EduScale
</h1>


<nav className="space-y-4">


<div className="flex gap-3">
<Home/>
Dashboard
</div>


<div className="flex gap-3">
<Users/>
Data Siswa
</div>


<div className="flex gap-3">
<BookOpen/>
Jurnal Mengajar
</div>


<div className="flex gap-3">
<ClipboardList/>
BK
</div>


<div className="flex gap-3">
<Settings/>
Pengaturan
</div>


</nav>


</div>


)

}