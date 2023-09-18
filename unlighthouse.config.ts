interface Page {
  goto: (arg0: string, arg1: { waitUntil: string }) => unknown
  $: (arg0: string) => Promise<{
    type: (arg0: string) => unknown
    click: () => unknown
  }>
  $eval: (
    arg0: string,
    arg1: (form: { submit: () => unknown }) => unknown
  ) => unknown
  waitForNavigation: (arg0: { waitUntil: string }) => Promise<unknown>
}

const config = {
  hooks: {
    async authenticate(page: Page) {
      // login to the page
      await page.goto("https://skateshop.sadmn.com/signin", {
        waitUntil: "networkidle0",
      })
      const emailInput = await page.$('input[type="text"]')
      await emailInput?.type("unlighthouse180@gmail.com")
      const passwordInput = await page.$('input[type="password"]')
      await passwordInput?.type("unlighT/18!House")
      const submitButton = await page.$('button[type="submit"]')
      await Promise.all([
        await submitButton?.click(),
        await page.waitForNavigation({
          waitUntil: "networkidle0",
        }),
      ])
    },
  },
}

export default config
