import  {supabaseAdmin} from "@/lib/supabaseAdmin"


export const dynamic = "force-dynamic";


export default async function Subscribers() {
    const {data, error} = await supabaseAdmin
    .from("subscribers")
    .select("id,email,created_at")
    .order("created_at" , {ascending: false})

    if (error) return <main className="p-8 text-red-500 "> エラー： {error.message}</main>

    return(
        <main className="p-8">
            <h1 className="text-xl font-bold mb-4">登録者一覧</h1>
            <ul className="space-y-2">
                {data?.map((s) => (
                <li className="border p-3 rounded" key={s.id}>
                <div className="font-mono">{s.email}</div>
                <div className=""> {new Date(s.created_at).toLocaleString()}</div>
            </li>
                ))}
                
            </ul>
        </main>
    )
}




