import type { CredentialsEmailData } from '../../types/email/credentialsEmail'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getLoginUrl(): string {
  const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || ''
  return appUrl.replace(/\/$/, '')
}

export function generateCredentialsEmailTemplate(data: CredentialsEmailData): string {
  const escapedName = escapeHtml(data.name)
  const escapedEmail = escapeHtml(data.email)
  const escapedUsername = escapeHtml(data.username)
  const escapedPassword = escapeHtml(data.password)
  const escapedDepartment = escapeHtml(data.department)
  const escapedRole = escapeHtml(data.role)
  const loginUrl = getLoginUrl()
  const escapedLoginUrl = escapeHtml(loginUrl)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Your Kwentas Klaras Account Credentials</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700;">Kwentas Klaras Account Credentials</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Hello ${escapedName},
                  </p>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Your account has been registered in Kwentas Klaras. Your email <strong>${escapedEmail}</strong> has been verified and you can now access your account using the credentials below.
                  </p>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    To use Kwentas Klaras, click the verification button. This helps keep your account secure.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Your Account Credentials</h2>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Name:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${escapedName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Email:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px;">${escapedEmail}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Username:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-family: monospace;">${escapedUsername}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Password:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-family: monospace; background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block;">${escapedPassword}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Department:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px;">${escapedDepartment}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Role:</p>
                          <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${escapedRole}</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 30px 40px; text-align: center;">
                  <a href="${escapedLoginUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">Login to Your Account</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 0 0 32px 0; border: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; text-align: center; font-weight: 500;">Or visit:</p>
                    <p style="margin: 0; text-align: center; word-break: break-all;">
                      <a href="${escapedLoginUrl}" style="color: #2563eb; text-decoration: none; font-size: 13px; font-weight: 500;">${escapedLoginUrl}</a>
                    </p>
                  </div>
                  <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    You're receiving this email because you have an account in Kwentas Klaras. If you are not sure why you're receiving this, please contact us by replying to this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} Kwentas Klaras. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

