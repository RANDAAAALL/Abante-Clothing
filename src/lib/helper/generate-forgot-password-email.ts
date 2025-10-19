import fs from "fs";
import path from "path";

export function generateForgotPasswordEmail(email: string, resetPasswordLink: string) {
  const htmlPath = path.join(
    process.cwd(),
    "src/components/ui/templates/email/forgot-password.html"
  );
  let htmlTemplate = fs.readFileSync(htmlPath, "utf8");

  // extract the name part before @
  const displayName = email.split("@")[0];

  // replace placeholders in the html template
  htmlTemplate = htmlTemplate
    .replace(/{{email}}/g, displayName)
    .replace(/{{resetPasswordLink}}/g, resetPasswordLink);

  return htmlTemplate;
}
