import fs from "fs";
import path from "path";

export function getEmailTemplate(
    filename: string,
    variables: Record<string, string>
) {
    const filePath = path.join(process.cwd(), "emails", filename);
    let html = fs.readFileSync(filePath, "utf8");
    for (const [key , value] of Object.entries(variables)){
        const regex = new RegExp(`{{${key}}}` , "g");
        html = html.replace(regex, value);
    }

    return html;
}