import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { transporter } from "@/lib/mailer";

function isValidEmail(s: string){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}


export async function POST(req: Request) {
    try{
        const { email: raw } = await req.json()
        const email = String(raw || "").trim().toLowerCase();

        if(!isValidEmail(email)){
            return NextResponse.json({message : "無効なメールアドレス"}, {status: 400});
        }


        //Supabaseに保存

        const {error} = await supabaseAdmin
        .from("subscribers")
        .insert([{ email }]);

        if (error){
            if (error.message.includes("duplicate key")){
                return NextResponse.json({message : "既に投稿済みです"}, {status: 409});
            }
            console.error("DB error:" , error);
            return NextResponse.json({message : "サーバーエラー（DB）"}, {status: 500});
        }

        //nodemailer

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "メールマガジンへようこそ",
            html:`<p> こんにちは！${email}, 登録ありがとうございます。</p>`
        })
        return  NextResponse.json({message : "登録完了しました。確認メールを送りました。"}, {status: 200});

    }catch(error){
        console.error("API error:", error);
        return NextResponse.json({message : "サーバーエラー"}, {status: 500});
    }
}