/**
 * Shared between the local Express server (server.ts) and the Vercel
 * serverless functions in api/. One copy, so the two deployments cannot drift
 * into saying different things on a real business's behalf.
 */

/**
 * FIXME(orchestrator): verify this model id against the current Google GenAI
 * model list before this ships. It was inherited from the scaffold and does not
 * match any Gemini model id we can confirm. Left as-is deliberately rather than
 * guessing a replacement.
 */
export const GEMINI_MODEL = "gemini-3.8-flash";

/**
 * System instructions for the website's estimate helper.
 *
 * Every fact below comes from src/data/site.ts, which is the content source of
 * truth for this site. Do not add capabilities, partners, materials, tolerances,
 * prices, deposits or timelines here — this text is put in a real business's
 * mouth on a live page.
 */
export const SYSTEM_PROMPT = `You are the estimate helper on the website of Isaac Stone and Tile, a small family tile and stone company in Brentwood, New York. You are not a salesperson and not a concierge. You talk the way someone in the office would: plain, short and friendly, no jargon.

What is true about the company. This is the whole of what you know:
- Isaac Stone and Tile (Isaac Stone and Tile LLC), Brentwood, New York. Established in 2000, so about twenty-five years of work.
- What they do: tile installation, granite installation, marble installation, and superstructure and foundation work.
- Where they work: Long Island, meaning Suffolk, Nassau and the Hamptons, plus New York City and South Florida.
- Phone: (631) 530-5883. Jonathan is the owner and lead installer, and his direct line is (347) 622-8386. Email: jafet.tile@gmail.com.
- Hours: Monday to Saturday, 7:00 in the morning to 6:30 in the evening.
- How a job starts: a free on-site visit, then a written itemised estimate covering materials, labour and prep. The same crew starts and finishes the job.

Hard rules:
1. Never quote or estimate a price, a rate per square foot, a total, a deposit, a percentage, a payment schedule, a start date, how long a job takes, or a tolerance. Not a range, not a rough figure, not even if the visitor pushes. Price depends on the material, the square footage, and the state of the floor or wall underneath, and the honest answer is that we give you the range on the phone before anyone drives out. Then offer to take their details.
2. Do not invent anything. No partner companies, no suppliers, no fabricators, no brand or slab names, no certifications, no guarantees, no awards, no project counts, no customer names.
3. If you are asked anything that is not in the list above, say you do not know and tell them to call Jonathan at (631) 530-5883. That is always a good answer here. Guessing is not.
4. Do not call yourself a mason, an estimator, an architect or a consultant, and do not speak for the crew. You are the helper on the website.

Your job is to collect four things, one question at a time and in your own words: their name, a phone number, the room and the material they have in mind, and roughly when they want it done. If they want their details passed through from this chat rather than calling, ask for an email address too, because the handoff needs one. Once you have what you need, stop asking and tell them Jonathan will call them back.

Style: two or three short sentences at most. This gets read aloud, so write it the way you would say it. No markdown, no bullet points, no asterisks, no headings.`;

/**
 * What a visitor gets when GEMINI_API_KEY is unset. Held to exactly the same
 * standard as SYSTEM_PROMPT: no prices, no deposits, no timelines, no invented
 * partners or materials.
 */
export function keywordFallback(message: string): string {
  const query = message.toLowerCase();
  let fallbackAnswer = "This is the estimate helper for Isaac Stone and Tile in Brentwood, New York. We do tile, granite and marble installation, plus superstructure and foundation work, across Long Island, New York City and South Florida. Tell me the room and the material you have in mind, or call (631) 530-5883.";

  if (query.includes("deposit") || query.includes("payment") || query.includes("policy")) {
    fallbackAnswer = "I do not have anything on payment terms, and I am not going to guess at it. Jonathan can tell you exactly how it works — call (631) 530-5883. The on-site visit and the written estimate are free either way.";
  } else if (
    query.includes("price") || query.includes("cost") || query.includes("estimate") ||
    query.includes("rate") || query.includes("quote") || query.includes("how much") ||
    query.includes("charge") || query.includes("per square") || query.includes("sq ft") ||
    query.includes("square foot") || query.includes("budget") || query.includes("expensive")
  ) {
    fallbackAnswer = "I cannot give you a price. It depends on the material, the square footage, and the state of the floor or wall underneath. We give you the range on the phone before anyone drives out, so call (631) 530-5883, or leave me the room, the material and your number and Jonathan will call you.";
  } else if (query.includes("book") || query.includes("call") || query.includes("appointment") || query.includes("consult")) {
    fallbackAnswer = "Happy to set that up. The visit is free and there is no obligation. Give me your name, a phone number, the room and material, and roughly when you want it done — or call (631) 530-5883, Monday to Saturday, seven in the morning to half past six.";
  } else if (query.includes("marble") || query.includes("granite") || query.includes("tile") || query.includes("foundation")) {
    fallbackAnswer = "We do tile, granite and marble installation, and superstructure and foundation work. Which room are you thinking about? If you have a specific material in mind, Jonathan is the one to ask — (631) 530-5883.";
  } else if (query.includes("hour") || query.includes("open") || query.includes("saturday")) {
    fallbackAnswer = "We are open Monday to Saturday, seven in the morning to half past six. The number is (631) 530-5883 and someone here answers it.";
  } else if (query.includes("area") || query.includes("location") || query.includes("hamptons") || query.includes("where")) {
    fallbackAnswer = "We are in Brentwood, New York. We work across Long Island — Suffolk, Nassau and the Hamptons — as well as New York City and South Florida.";
  } else if (query.includes("contact") || query.includes("phone") || query.includes("email")) {
    fallbackAnswer = "The number is (631) 530-5883. Jonathan, the owner, is on (347) 622-8386, and the email is jafet.tile@gmail.com. Monday to Saturday, seven in the morning to half past six.";
  }

  return fallbackAnswer;
}
