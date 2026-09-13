"""Fluxo: perfil do vendedor -> abrir conversa -> enviar mensagem."""
import asyncio
import os
import sys

from playwright.async_api import async_playwright

sys.path.insert(0, os.path.dirname(__file__))
from common import BASE_URL, new_authenticated_page  # noqa: E402

SELLER = os.environ.get("E2E_SELLER", "user_2e76974a")
TEXT = "Mensagem de teste automatizado"


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page, errors = await new_authenticated_page(browser)

        await page.goto(f"{BASE_URL}/vendedor/{SELLER}", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        button = page.get_by_role("button", name="Mensagem").first
        if await button.count() == 0:
            button = page.locator("a,button", has_text="Mensagem").first
        await button.click()
        await page.wait_for_timeout(4000)
        assert "/mensagens" in page.url, f"não abriu a conversa: {page.url}"

        box = page.get_by_placeholder("Escreva uma mensagem")
        if await box.count() == 0:
            box = page.locator("textarea, input[type=text]").last
        await box.fill(TEXT)
        await page.keyboard.press("Enter")
        await page.wait_for_timeout(3000)

        assert await page.get_by_text(TEXT).count() > 0, "mensagem não apareceu na conversa"
        assert not errors, f"erros na página: {errors[:3]}"
        print("chat_test OK")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(run())
