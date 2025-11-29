import  {supabaseAdmin} from "@/lib/supabaseAdmin"
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";


export default async function Subscribers() {

    const session = await auth0.getSession();
    const user = session?.user as {email? :string}

    if (!user){
        redirect("auth/login?returnTo=/subscribers")
    }



if (!user.email || user.email !== process.env.ADMIN_EMAIL){
    return (
        <main className="p-6">
            <h1 className="text-xl font-bold mb-6">アクセス拒否</h1>
            <p className="text-2xl text-red-600">
                このページは管理者専用ページです
            </p>
        </main>
    )
}

 const {data, error} = await supabaseAdmin
    .from("subscribers")
    .select("id,email,created_at")
    .order("created_at" , {ascending: false})

    if (error) return <main className="p-8 text-red-500 "> エラー： {error.message}</main>

    return(
        <main className="p-8">
          <a href="auth/logout"  className="absolute inset-y-0 right-0 mr-4 mt-4 text-purple-600 underline">ログアウト</a>
            <h1 className="text-xl font-bold mb-4">登録者一覧</h1>

            <a 
            href="/api/subscribers/export"
            className="text-sm px-3 py-1 border rounded bg-purple-500 text-white hover:bg-purple-700"
            >
                ダウンロード
            </a>
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




