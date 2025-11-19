"use client";



export function AuthLinks(){
    return (
        <div className="flex gap-4 text-sm">
            <a href="/api/auth/login">ログイン</a>
    <a href="api/auth/logout">ログアウト</a>
        </div>
    )
}