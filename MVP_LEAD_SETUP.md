# Isaac Stone & Tile — Lean Lead MVP setup

This is deliberately not a full CRM. It protects the thing that matters first:
an estimate request is recorded, the owner is alerted, and the customer can be
confirmed without an invented price or a manual copy-and-paste handoff.

## What happens after one submission

1. The form or Wamy review screen sends name, phone, project notes, preferred
   callback time, and a transcript when it came from Wamy.
2. The server first sends the record to `LEAD_WEBHOOK_URL` when configured.
   Use that webhook to create one row in Google Sheets, Airtable, or an n8n
   table with status `new`.
3. Resend emails the full lead to the owner and confirms the request to a
   customer who supplied an email address.
4. Twilio texts the owner about the new lead. It texts the visitor only if they
   explicitly opt in on the form/review screen.
5. A human calls the prospect and gives any actual quote. The site never makes
   up a price.

## Minimum live configuration

Set these in Vercel → Project → Settings → Environment Variables:

```text
LEAD_WEBHOOK_URL=https://your-automation.example/webhook/isaac-leads
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Isaac Stone and Tile <leads@your-verified-domain.com>
OWNER_EMAIL=the-team-inbox@example.com
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
TWILIO_OWNER_TO_NUMBER=+1...
```

`LEAD_WEBHOOK_URL` is recommended because it becomes the durable lead list.
If it is absent, the app only accepts a hosted lead when the owner Resend inbox
is configured and delivery succeeds. If neither destination is configured, the
visitor sees the business phone number instead of a false success message.

## Lightweight follow-up board

Use a Google Sheet or Airtable connected to the webhook with these columns:

```text
id | createdAt | status | source | name | phone | email | projectType | preferredCallTime | notes
```

Start every lead with `status = new`, then move it through `contacted`,
`visit booked`, `estimate sent`, `won`, or `closed`. This gives the owner a
real recovery loop now; migrating that same data to a larger CRM later is easy.

## Before launch

- Verify the Resend sender domain and Twilio phone number.
- Test the public form once with your own phone and email.
- Confirm the webhook received exactly one `new` record.
- Confirm the owner email/SMS arrives, then confirm the customer email/SMS.
- Do not turn on customer SMS until the wording and consent flow are approved.
