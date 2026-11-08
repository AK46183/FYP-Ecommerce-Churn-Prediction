"""
MINAYSH - get one image + colour for every shade of a product.

Example (run inside the project folder, where package.json is):
    python scripts/sync-shades.py fd-001 "fit me matte poreless foundation" --exclude mini tube powder

  fd-001         = your product id (from src/data/...)
  "fit me ..."   = what to search on makeupcityshop.com
  --exclude ...  = words that must NOT be in the title (other sizes / products)

What it does:
  * finds the matching products on makeupcityshop.com (one product per shade there)
  * matches them to your shades by shade number (110, 112, 115 ...)
  * downloads the photo, removes the white background, trims it
  * saves  public/images/shades/<id>/<shade>.webp  (transparent)
  * reads the real shade colour from the photo
  * writes everything into  src/data/shadeImages.js
Shades it can't find keep the normal product photo on the site.

Or with a ready list of official brand photos (made for you):
    python scripts/sync-shades.py fd-001 --list scripts/fd-001-shades.json
"""
import io, json, os, re, sys, urllib.parse, urllib.request
from collections import deque
from PIL import Image

STORE = 'https://www.makeupcityshop.com'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', 'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8'}
DATA_FILE = os.path.join('src', 'data', 'shadeImages.js')
PREFIX = 'export const SHADE_IMAGES = '


def get(url, as_json=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read()
    return json.loads(body) if as_json else body


def shade_code(text):
    m = re.match(r'\s*([A-Za-z]?\d{1,4}[A-Za-z]?)\b', text or '')
    return m.group(1).upper() if m else None


def find_products(query, exclude):
    handles = []
    for page in range(1, 6):
        url = f'{STORE}/search?type=product&q={urllib.parse.quote_plus(query)}&page={page}'
        html = get(url).decode('utf-8', 'ignore')
        found = re.findall(r'/products/([a-z0-9\-]+)', html)
        new = [h for h in dict.fromkeys(found) if h not in handles]
        if not new:
            break
        handles += new
    words = [w.lower() for w in query.split() if len(w) > 2]
    results = []
    for h in handles:
        try:
            p = get(f'{STORE}/products/{h}.js', as_json=True)
        except Exception:
            continue
        title = p.get('title', '').lower()
        if not all(w in title for w in words if w not in ('foundation', 'liquid')):
            continue
        if any(x.lower() in title for x in exclude):
            continue
        tail = p['title'].split(' - ')[-1]
        code = shade_code(tail)
        img = p.get('featured_image') or (p.get('images') or [None])[0]
        if code and img:
            results.append((code, p['title'], 'https:' + img.split('?')[0] if img.startswith('//') else img.split('?')[0]))
    return results


def cut_out(im):
    """white background -> transparent, using flood fill from the edges"""
    im = im.convert('RGB')
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q = deque()
    def is_bg(x, y):
        r, g, b = px[x, y]
        return r > 232 and g > 232 and b > 232 and max(r, g, b) - min(r, g, b) < 18
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i] or not is_bg(x, y):
            continue
        seen[i] = 1
        if x > 0: q.append((x - 1, y))
        if x < w - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < h - 1: q.append((x, y + 1))
    alpha = Image.frombytes('L', (w, h), bytes(0 if s else 255 for s in seen))
    from PIL import ImageFilter
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert('RGBA')
    out.putalpha(alpha)
    box = alpha.point(lambda a: 255 if a > 20 else 0).getbbox()
    return out.crop(box) if box else out


def shape_of(rgba):
    """how the bottle is built: total aspect, where the cap ends, cap width (for the 3D view)"""
    a = rgba.getchannel('A')
    w, h = a.size
    px = a.load()
    widths = []
    for y in range(h):
        xs = [x for x in range(0, w, 2) if px[x, y] > 128]
        widths.append((xs[-1] - xs[0]) if len(xs) > 1 else 0)
    lower = sorted(widths[h // 2:])
    body = lower[len(lower) // 2] or w
    shoulder = next((y for y in range(h) if widths[y] >= body * 0.9), 0)
    cap_rows = [v for v in widths[:max(1, shoulder)] if v > 0]
    cap_rows.sort()
    cap_w = cap_rows[len(cap_rows) // 2] if cap_rows else body
    return {
        'aspect': round(w / h, 4),
        'cap': round(shoulder / h, 4),
        'capWidth': round(min(1, cap_w / body), 4),
        'bodyWidth': round(min(1, body / w), 4),
    }


def main_colour(rgba):
    small = rgba.copy()
    small.thumbnail((160, 160))
    vals = []
    for r, g, b, a in small.getdata():
        if a < 200:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        if mx > 238 or mx < 55 or mx - mn < 14:   # skip white label, black cap, grey
            continue
        vals.append((r, g, b))
    if not vals:
        return None
    vals.sort(key=lambda c: sum(c))
    mid = vals[len(vals) // 2]
    return '#%02x%02x%02x' % mid


def load_data():
    if not os.path.isfile(DATA_FILE):
        return {}
    text = open(DATA_FILE, encoding='utf-8').read()
    start = text.find('{')
    try:
        return json.loads(text[start:text.rfind('}') + 1])
    except Exception:
        return {}


def save_data(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('// Made by sync-shades.py - one image + colour per shade.\n')
        fh.write('// Shades not listed here use the normal product photo.\n')
        fh.write(PREFIX + json.dumps(data, indent=2, ensure_ascii=False) + '\n')


def main():
    if not os.path.isfile('package.json'):
        sys.exit('Run this inside the minaysh project folder (where package.json is).')
    args = sys.argv[1:]
    if len(args) < 2:
        sys.exit(__doc__)
    pid = args[0]
    names, colours = {}, {}
    if '--list' in args:
        listing = json.load(open(args[args.index('--list') + 1], encoding='utf-8'))
        found = []
        for code, item in listing['shades'].items():
            found.append((code.upper(), item.get('name', ''), item['url']))
            names[code.upper()] = item.get('name')
            colours[code.upper()] = item.get('color')
        print(f'Using the list: {len(found)} shades ({listing.get("source", "")})')
    else:
        query = args[1]
        exclude = args[args.index('--exclude') + 1:] if '--exclude' in args else []
        print(f'Searching makeupcityshop.com for "{query}" ...')
        found = find_products(query, exclude)
    if not found:
        sys.exit('Nothing found - try a shorter search text.')
    print(f'Found {len(found)} shades there.')

    folder = os.path.join('public', 'images', 'shades', pid)
    os.makedirs(folder, exist_ok=True)
    data = load_data()
    entry = data.get(pid, {})
    for code, title, url in found:
        if '--list' not in args and code in entry and os.path.isfile(os.path.join('public', entry[code]['image'].lstrip('/'))):
            print(f'  {code:6} already done')
            continue
        try:
            raw = get(url if '--list' in args else url + '?width=900')
            im = cut_out(Image.open(io.BytesIO(raw)))
            im.thumbnail((700, 700))
            name = code.lower() + '.webp'
            im.save(os.path.join(folder, name), 'WEBP', quality=82, method=4)
            entry[code] = {'image': f'/images/shades/{pid}/{name}', 'color': colours.get(code) or main_colour(im), 'name': names.get(code) or '', 'title': title, 'shape': shape_of(im)}
            print(f'  {code:6} ok   {entry[code]["color"]}   {title}')
        except Exception as err:
            print(f'  {code:6} skipped - {err}')
    data[pid] = entry
    save_data(data)
    print(f'\nSaved {len(entry)} shades for {pid} in {DATA_FILE}')
    print('Shade numbers are matched to your shades automatically (e.g. "115 Ivory" -> 115).')


if __name__ == '__main__':
    main()
