"""Utilidades partilhadas pelos testes ponta a ponta."""
import json
import os

BASE_URL = os.environ.get("E2E_BASE_URL", "http://localhost:8080")


async def new_authenticated_page(browser, width=1280, height=1000):
    """Abre uma página já com a sessão do usuário restaurada (quando disponível)."""
    context = await browser.new_context(viewport={"width": width, "height": height})
    cookies = os.environ.get("E2E_SUPABASE_COOKIES_JSON")
    if cookies:
        await context.add_cookies([{**c, "url": BASE_URL} for c in json.loads(cookies)])
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    await page.goto(BASE_URL, wait_until="domcontentloaded")
    key = os.environ.get("E2E_SUPABASE_STORAGE_KEY")
    session = os.environ.get("E2E_SUPABASE_SESSION_JSON")
    if not (key and session):
        path = os.path.expanduser("~/.cache/charm-code-compass-auth/session.json")
        if os.path.exists(path):
            with open(path) as fh:
                data = json.load(fh)
            key = key or data.get("storage_key")
            session = session or json.dumps(data.get("session") or data)
    if key and session:
        await page.evaluate(
            f"localStorage.setItem({json.dumps(key)}, {json.dumps(session)})"
        )
    return page, errors
