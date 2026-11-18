"""Har module alag test (bina API key ke):  python test_modules.py"""
from rag import Retriever
from products import ProductSearch
import safety
from assistant import Assistant

r = Retriever(); print("chunks:", len(r.chunks))
for q, expect in [("blackheads on oily skin", "Salicylic"), ("dry flaky tight skin", "Dry skin"),
                  ("dark marks after pimples", "Dark spots"), ("pregnant can I use retinol", "Pregnancy"),
                  ("sunscreen how much", "Sunscreen")]:
    top = r.search(q, k=3)
    ok = any(expect.lower() in c["title"].lower() for c in top)
    print(("PASS" if ok else "FAIL"), q, "->", [c["title"] for c in top])

s = ProductSearch(); print("products:", len(s.items))
print("sunscreens:", [p["name"] for p in s.search("sunscreen", limit=2)])
print("acne serums:", [(p["name"], p["tags"]) for p in s.search("serum", ["acne", "spots"], limit=3)])
print("allergy filter:", [p["name"] for p in s.search("cleanser", ["acne"], exclude_terms=["garnier"], limit=3)])

assert safety.check("my mole is bleeding")["red_flag"]
assert safety.check("I am pregnant")["pregnancy"]
assert not safety.check("I have oily skin")["red_flag"]
assert "retinol" in safety.exclude_terms({"pregnancy": True, "allergies": ["niacinamide"]})
a = Assistant(); print(a.chat("I'm pregnant and have a bleeding mole"))
assert a.state["pregnancy"]
b = Assistant()
b.chat("meri skin oily hai aur pimples hain")
assert b.state["concerns"] == ["acne"] and not b.state["pregnancy_answered"]
b.chat("koi allergy nahi hai aur pregnant nahi hoon")
assert b.profile_complete() and not b.state["pregnancy"]
ctx = b.build_context("routine")
assert "STORE PRODUCTS" in ctx and "PKR" in ctx
print(ctx)
print("safety PASS")
