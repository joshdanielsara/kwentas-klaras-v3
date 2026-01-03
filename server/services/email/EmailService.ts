import * as brevo from '@getbrevo/brevo'
import type { CredentialsEmailData } from '../../types/email/credentialsEmail'
import { generateCredentialsEmailTemplate } from '../../utils/emailTemplates/credentialsEmailTemplate'

export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi
  private senderEmail: string
  private senderName: string

  constructor() {
    const apiKey = process.env.BREVO_API_KEY || ''

    this.apiInstance = new brevo.TransactionalEmailsApi()
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey
    )

    this.senderEmail = process.env.BREVO_SENDER_EMAIL || ''
    this.senderName = process.env.BREVO_SENDER_NAME || 'Kwentas Klaras'
  }

  async sendCredentialsEmail(data: CredentialsEmailData): Promise<void> {
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY not configured. Email will not be sent.')
      return
    }

    if (!this.senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL is not configured')
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = 'Your Kwentas Klaras Account Credentials'
    sendSmtpEmail.htmlContent = generateCredentialsEmailTemplate(data)
    sendSmtpEmail.sender = { name: this.senderName, email: this.senderEmail }
    sendSmtpEmail.to = [{ email: data.email, name: data.name }]

    try {
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail)
      if (!response.body?.messageId) {
        throw new Error('No messageId in BREVO API response')
      }
    } catch (error: any) {
      console.error('Failed to send credentials email:', error)
      throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`)
    }
  }
}

