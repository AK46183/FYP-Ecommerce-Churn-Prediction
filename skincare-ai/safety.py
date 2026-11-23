"""Code-level safety: LLM par bharosa nahi, in rules ko code check karta hai."""
import re

RED_FLAGS = [
    r"mole.*(chang|bleed|grow|dark)", r"bleed", r"non[- ]?healing", r"pus\b.*(fever|swell|spread|redness|painful|bukhar)", r"(fever|swell|spread).*pus\b", r"fever", r"swell(ing|en).*(lip|face|eye)",
    r"difficulty breath|trouble breath|can'?t breathe", r"cyst", r"scar", r"spreading", r"severe (pain|rash)",
    r"mole.*(bara|bada|barh|bigg|larger|spread)", r"hair loss", r"khoon", r"sans.*(mushkil|problem)",
]
PREGNANCY = [r"pregnan", r"breast ?feed", r"nursing", r"hamila", r"expecting"]
# "pregnant nahi hoon" / "not pregnant" -> pregnancy NAHI
NOT_PREGNANT = [r"(not|n't|no|never)\s+(\w+\s+)?(pregnan|breast ?feed|expecting)",
                r"(pregnan\w*|hamila|breast ?feed\w*)\s+(\w+\s+)?(nahi|nhi|nahin|nai)\b"]
RETINOID_TERMS = ["retinol", "retinal", "retinyl", "retinoid", "adapalene", "tretinoin", "retin-a", "accutane"]
# red flag mein se sirf ye emergency hain
EMERGENCY = [r"difficulty breath|trouble breath|can'?t breathe", r"swell(ing|en).*(lip|face)"]


# bohot pareshani / khud ko nuqsan ki baat: LLM nahi, code jawab deta hai
DISTRESS = [r"suicid", r"khud ?kushi", r"kill myself", r"end my life", r"want to die", r"wanna die", r"no reason to live",
            r"life is over", r"mar(na|ne)? (jana |jaana )?chaht", r"mar jau", r"mar jaun", r"jee?n[ae] (ka|ko) (dil|mann|man) nahi",
            r"jeena nahi chaht", r"zindagi (khatam|khtm|khatm)", r"apni jaan le", r"hurt myself", r"self[- ]?harm"]

DISTRESS_REPLY = {
    "ur": ("Yeh sun kar mujhe fikar hui. Agar aap sach mein bohot pareshan hain to please kisi apne se, ya kisi doctor ya counsellor se "
           "baat zaroor karein, aur agar abhi khatra mehsoos ho to foran emergency number ya qareebi hospital se rabta karein. "
           "Aur agar aap ne aise hi keh diya tha to koi baat nahi, main yahan hoon. Skin ke baare mein jo poochna ho, poochiye."),
    "en": ("I am really sorry you are feeling this way. If things feel very heavy, please talk to someone you trust, or a doctor or counsellor, "
           "and if you feel in danger right now, contact your local emergency number or the nearest hospital. "
           "And if you only said it in passing, that is okay too. I am here whenever you want to talk about your skin."),
}

OTHER_PERSON = (r"\b(dost|friend|saheli|sister|behen|bahen|behn|baji|bhabhi|bhabi|cousin|wife|biwi|begum|mother|mom|mum|ammi|ami|"
                r"khala|phupho|chachi|mami|nand|devrani|jethani|daughter|beti|colleague|neighbou?r|she|her|uski|unki|unko|usko|"
                r"wo|woh|someone|kisi)\b")
SELF_PREGNANT = r"\b(i am|i'm|im|main|mai|mein)\s+(\w+\s+)?(pregnan|hamila|expecting)|pregnan\w*\s+(hoon|hun|hu)\b"


def check(text):
    t = text.lower()
    negated = any(re.search(p, t) for p in NOT_PREGNANT)
    res = {"red_flag": any(re.search(p, t) for p in RED_FLAGS),
           "emergency": any(re.search(p, t) for p in EMERGENCY),
           "pregnancy": (not negated) and any(re.search(p, t) for p in PREGNANCY),
           "not_pregnant": negated, "pregnancy_other_person": False,
           "distress": any(re.search(p, t) for p in DISTRESS)}
    # "meri dost / sister pregnant hai" -> user khud pregnant NAHI
    if res["pregnancy"] and re.search(OTHER_PERSON, t) and not re.search(SELF_PREGNANT, t):
        res["pregnancy"], res["pregnancy_other_person"] = False, True
    return res


PREGNANCY_AVOID = RETINOID_TERMS + ["glycolic", "salicylic", "bha", "aha", "peel", "acne", " sa "]  # conservative, naam se pakda jata hai


def exclude_terms(state):
    terms = list(state.get("allergies", []))
    if state.get("pregnancy"):
        terms += PREGNANCY_AVOID
    return terms


def filter_text(reply, state):
    """Reply mein pregnancy hone par retinoid sifarish ho to warning jod do (last line of defence)."""
    if state.get("pregnancy") and any(w in reply.lower() for w in PREGNANCY_AVOID):
        reply += "\n\n(Note: pregnancy/breastfeeding mein retinoids use na karein; doctor se confirm karein.)"
    return reply
