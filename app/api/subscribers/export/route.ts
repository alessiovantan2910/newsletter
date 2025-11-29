import { supabaseAdmin } from "@/lib/supabaseAdmin";

import { NextResponse } from "next/server";


export async function GET() {
    //1.DBからデータを取得するロジック　＋　エラーハンドリング
    const { data , error } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", {ascending: false})

    if (error){
        console.error("DB エラー", error);
        return NextResponse.json(
            { message: "DB エラー CSV作成できませんでした"},
            {status: 500}
        )
    }
    
    //データがないときも空CSVを返す(任意　あったほうがいい)
    const rows = data ?? [];

    //2.CSV文字列を作成するロジック

    const header = ["id", "email", "created_at"]

    const lines = rows.map((row) =>{
        const id = String(row.id ?? "");
        const email = String(row.email ?? "");
        const created_at = row.created_at ? new Date(row.created_at).toISOString() : "";
    })

    const escape = (value: string) => 
        `"${value.replace(/"/g, "''")}"`;

    const csvBody = [header.join(","), ...lines].join("\n");

    //EXCElで文字化けしないように

    const csvWithBom = "\uFEFF" + csvBody;

    return new Response(csvWithBom, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; chartset=utf8",
            "Content-Disposition": 'attachment; filename="subscribers.csv"'
        },
    });

}