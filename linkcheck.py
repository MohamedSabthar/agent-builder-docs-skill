"""Check every link and #anchor in the article body of built docs pages.
Serve the built site first: `npx docusaurus serve --port 3001` (from en/).
product:// links (/integration-platform/docs/<product>/...) are listed as XPR: verify them in the
target product's source branch, because localhost can't serve them and wso2.com returns 403 to scripts.
Exit status 1 if any link is broken."""
import re, sys, urllib.request, urllib.error, html, ssl
from urllib.parse import urljoin, urldefrag
import os
BASE = os.environ.get("LINKCHECK_BASE", "http://localhost:3001")
# Page routes to check, e.g. /develop-and-test/integration-artifacts/ai-integrations/agents/tools
PAGES = sys.argv[1:]
if not PAGES:
    sys.exit("usage: python3 linkcheck.py <page-route> [...]   (site served at %s)" % BASE)
PROD = "https://wso2.com"
ctx = ssl.create_default_context()
cache = {}
def fetch(url):
    if url in cache: return cache[url]
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 linkcheck"})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            body = r.read().decode("utf-8", "ignore"); res = (r.status, r.geturl(), body)
    except urllib.error.HTTPError as e: res = (e.code, url, "")
    except Exception as e: res = (str(e)[:60], url, "")
    cache[url] = res; return res
def ids(body): return set(re.findall(r'\sid="([^"]+)"', body))
problems = 0
for p in PAGES:
    st, _, body = fetch(BASE + p)
    # only the article content, not nav/footer
    m = re.search(r'<article.*?</article>', body, re.S); art = m.group(0) if m else body
    hrefs = sorted(set(html.unescape(h) for h in re.findall(r'<a[^>]+href="([^"]+)"', art)))
    print(f"\n== {p} ({st}) {len(hrefs)} links")
    for h in hrefs:
        if h.startswith(("mailto:", "javascript:")): continue
        if h.startswith("#"): url = BASE + p + h
        elif h.startswith("/integration-platform/docs/"):
            # Other products are not served locally and wso2.com blocks bots (403), so list
            # these for a source check instead: find the page in the target product's branch
            # (integrator -> wso2-integrator, saas -> saas, connectors -> wso2-connectors) and
            # confirm the #anchor heading exists.
            print(f"  XPR (other product; verify against its source branch) {h}"); continue
        elif h.startswith("/"): url = BASE + h
        elif h.startswith("http"): url = h
        else: url = urljoin(BASE + p + "/", h)
        page, frag = urldefrag(url)
        st2, final, b2 = fetch(page)
        ok = st2 == 200 and "Page Not Found" not in b2
        note = ""
        if ok and frag and frag not in ids(b2): ok = False; note = f" (anchor #{frag} missing)"
        if not ok: problems += 1
        print(f"  {'OK ' if ok else 'BAD'} {st2} {h}{note}")
print(f"\nproblems: {problems}")
sys.exit(1 if problems else 0)
