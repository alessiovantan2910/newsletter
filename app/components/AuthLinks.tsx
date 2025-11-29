"use client";



export function AuthLinks(){
    return (
        <div className="flex gap-4 text-sm">
            <a href="/auth/login">ログイン</a>
    <a href="/auth/logout">ログアウト</a>
        </div>
    )
}