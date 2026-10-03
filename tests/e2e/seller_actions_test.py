"""E2E: botões "Mensagem" e "Seguir" no perfil da loja.

Cobre: abertura de conversa nova, reutilização da conversa existente e seguir/deixar de seguir.
Uso: python3 tests/e2e/seller_actions_test.py
"""
import asyncio
import sys

from playwright.async_api import async_playwright

from common import BASE_URL, new_authenticated_page


async def pick_other_seller(page):
    """Devolve o slug de uma loja que não seja a do próprio usuário."""
    await page.goto(f"{BASE_URL}/vendedores", wait_until="domcontentloaded")
    await page.wait_for_timeout(2500)
    hrefs = await page.eval_on_selector_all(
        "a[href^='/vendedor/']", "els => els.map(e => e.getAttribute('href'))"
    )
    me = await page.evaluate(
        "() => document.querySelector('[aria-label=\"Menu da conta\"]')?.innerText || ''"
    )
    for href in hrefs:
        slug = href.split("/vendedor/")[-1]
        if slug and slug not in me:
            return slug
    return None


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page, errors = await new_authenticated_page(browser)
        failures = []

        slug = await pick_other_seller(page)
        if not slug:
            print("SKIP: nenhuma loja de outro usuário disponível")
            await browser.close()
            return 0

        await page.goto(f"{BASE_URL}/vendedor/{slug}", wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)

        # ---- Seguir ----
        follow = page.get_by_role("button", name="Seguir").first
        if await follow.count():
            await follow.click()
            await page.wait_for_timeout(2500)
            body = await page.inner_text("body")
            if "Não foi possível" in body:
                failures.append(f"Seguir falhou: {body[:200]}")
            elif "A seguir" not in body:
                failures.append("Botão não mudou para 'A seguir'")
        else:
            print("INFO: já seguia esta loja")

        # ---- Mensagem (cria a conversa) ----
        await page.get_by_role("button", name="Mensagem").first.click()
        await page.wait_for_timeout(4000)
        if "/mensagens" not in page.url:
            failures.append(f"Mensagem não abriu o chat (url={page.url})")
        first_url = page.url

        # ---- Mensagem outra vez (deve reutilizar a mesma conversa) ----
        await page.goto(f"{BASE_URL}/vendedor/{slug}", wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)
        await page.get_by_role("button", name="Mensagem").first.click()
        await page.wait_for_timeout(4000)
        if page.url != first_url:
            failures.append(f"Conversa duplicada: {first_url} != {page.url}")

        await page.screenshot(path="/tmp/browser/seller_actions.png")
        await browser.close()

        for e in errors:
            failures.append(f"Erro de página: {e}")
        if failures:
            print("FALHOU:")
            for f in failures:
                print(" -", f)
            return 1
        print("OK: Mensagem e Seguir funcionam no perfil da loja")
        return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(run()))
