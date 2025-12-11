import { Resend } from 'resend';

const resend = new Resend('re_K8KswfKD_WYUh91h4KfwQHdreMYWrRJX4');

export const sendEmail = async (email: string, body: string) => {
  try {
    console.log('Sending email to:', email, 'body:', body)
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Yellit',
      html: body
    });
    console.log('Email sent successfully:', result)
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};