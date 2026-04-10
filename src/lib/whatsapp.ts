export async function sendWhatsApp(message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
  const djPhone = process.env.DJ_WHATSAPP_NUMBER!;

  try {
    await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: djPhone,
        type: 'text',
        text: { body: message },
      }),
    });
  } catch(e) {
    console.error("WhatsApp Send Details Failed", e);
  }
}
