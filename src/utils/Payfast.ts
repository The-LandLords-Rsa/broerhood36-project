export function payWithPayfast({ name, email, amount, item_name }: any) {
  const merchant_id = import.meta.env.VITE_PAYFAST_MERCHANT_ID
  const merchant_key = import.meta.env.VITE_PAYFAST_MERCHANT_KEY

  // For testing, use sandbox. For live, change to www.payfast.co.za
  const PAYFAST_URL = "https://www.payfast.co.za/eng/process"
  // For test mode: "https://sandbox.payfast.co.za/eng/process"

  const data = {
    merchant_id,
    merchant_key,
    return_url: window.location.origin + "/success",
    cancel_url: window.location.origin + "/cancel",
    notify_url: window.location.origin + "/api/notify",
    name_first: name.split(" ")[0] || "Customer",
    name_last: name.split(" ")[1] || "Broerhood",
    email_address: email,
    m_payment_id: `BROERHOOD_${Date.now()}`,
    amount: amount.toFixed(2),
    item_name: item_name || "Broerhood Order",
  }

  const form = document.createElement("form")
  form.method = "POST"
  form.action = PAYFAST_URL

  for (const [key, value] of Object.entries(data)) {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}