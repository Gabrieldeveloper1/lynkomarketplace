"""Roda todos os testes ponta a ponta em sequência."""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

import chat_test  # noqa: E402
import checkout_test  # noqa: E402
import seller_actions_test  # noqa: E402


async def main():
    failures = []
    for name, mod in (("chat", chat_test), ("checkout", checkout_test), ("seller_actions", seller_actions_test)):
        try:
            await mod.run()
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{name}: {exc}")
            print(f"{name}_test FALHOU: {exc}")
    if failures:
        sys.exit(1)
    print("todos os testes passaram")


if __name__ == "__main__":
    asyncio.run(main())
