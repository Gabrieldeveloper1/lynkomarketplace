"""Fluxo: checkout de um produto -> gerar Pix -> pedido criado."""
import asyncio
import os
import sys

from playwright.async_api import async_playwright

sys.path.insert(0, os.path.dirname(__file__))
from common import BASE_URL, new_authenticated_page  # noqa: E402

PRODUCT = os.environ.get("E2E_PRODUCT", "ds-m77di")
VARIANT = os.environ.get("E2E_VARIANT", "")


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page, errors = await new_authenticated_page(browser)

        url = f"{BASE_URL}/checkout/{PRODUCT}"
        if VARIANT:
            url += f"?variant={VARIANT}"
        await page.goto(url, wait_until="domcontentloaded")
        await page.wait_for_timeout(4000)

        await page.get_by_placeholder("Como no documento").fill("Comprador Teste")
        await page.get_by_placeholder("000.000.000-00").fill("12345678909")
        await page.get_by_placeholder("(11) 99999-9999").fill("11999999999")

        button = page.locator("button", has_text="Pix").first
        async with page.expect_response(
            lambda r: "_serverFn" in r.url, timeout=45000
        ) as info:
            await button.click()
        response = await info.value
        body = await response.text()

        assert response.status == 200, f"resposta {response.status}"
        assert "orderId" in body, f"pedido não criado: {body[:400]}"
        assert "pixCode" in body, f"Pix não gerado: {body[:400]}"
        assert not errors, f"erros na página: {errors[:3]}"
        print("checkout_test OK")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(run())
