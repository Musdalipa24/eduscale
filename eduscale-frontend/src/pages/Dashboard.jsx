import AdminLayout from "../layout/AdminLayout";


function Card({title,value}){


return(

<div className="
bg-white
shadow
rounded-xl
p-5
">


<p className="text-gray-500">
{title}
</p>


<h2 className="
text-3xl
font-bold
mt-3
">
{value}
</h2>


</div>

)

}



export default function Dashboard(){


return(

<AdminLayout>


<h1 className="
text-3xl
font-bold
mb-6
">
Selamat Datang Admin 👋
</h1>



<div className="
grid
grid-cols-3
gap-5
">


<Card
title="Total Siswa"
value="1200"
/>


<Card
title="Total Guru"
value="85"
/>


<Card
title="Aktivitas Sistem"
value="542"
/>


</div>



<div className="
bg-white
rounded-xl
shadow
mt-8
p-6
">


<h2 className="font-bold text-xl">
Aktivitas Terbaru
</h2>


<table className="
w-full
mt-5
">


<thead>

<tr className="text-left">

<th>User</th>
<th>Aktivitas</th>
<th>Waktu</th>

</tr>

</thead>


<tbody>


<tr>

<td>Guru</td>
<td>Input Jurnal</td>
<td>10:20</td>

</tr>


<tr>

<td>BK</td>
<td>Tambah Konseling</td>
<td>10:30</td>

</tr>


</tbody>


</table>


</div>



</AdminLayout>

)

}