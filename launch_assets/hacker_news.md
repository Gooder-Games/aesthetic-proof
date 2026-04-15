# Hacker News Launch Details

## Title
Show HN: Aesthetic Proof – An Edge API that renders JSON reviews into PNGs

## Body
Hey HN,

I always found building a visually appealing "Wall of Love" for side projects to be disproportionately time-consuming. You either manually format screenshots or build a heavy client-side React component that breaks easily.

I built Aesthetic Proof to solve this. It's a single POST endpoint. You throw it JSON containing a customer's name, handle, review text, and a rating. It instantly streams back a 1200x630 PNG.

Under the hood, it's pretty interesting:
- It runs exclusively on the Vercel Edge Runtime.
- It dynamically generates SVG markup using Facebook's Yoga engine (via `satori`) using an embedded font file (Inter).
- It then rasterizes that SVG into a static PNG in memory using `@vercel/og` (`resvg`), bypassing the need for a headless browser like Puppeteer. By avoiding Chromium, cold boots are under 50ms.
- To counter the lack of `backdrop-filter: blur()` in Satori, it uses complex stacked radial gradients to achieve a true glassmorphic aesthetic mathematically.

It's monetized via a simple Stripe credit system (you get 25 free on signup to mess around). It includes an OpenAPI spec so you can plug it straight into LangChain or Zapier.

I'd love to hear your thoughts on the Edge execution or the styling engine! 

Check out the endpoint documentation here: https://aesthetic-proof.com/docs
