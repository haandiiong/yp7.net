from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
import json,re,urllib.request,urllib.error,xml.etree.ElementTree as ET
ROOT=Path.cwd(); DIST=ROOT/'docs/.vuepress/dist'; OUT=ROOT/'reports/final-project-check-2026-11-02'
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.ids=[];self.refs=[];self.h1=0;self.canonical=[];self.robots=[];self.jsonld=[];self.inscript=False;self.text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='a' and a.get('name'):self.ids.append(a['name'])
  if tag=='h1':self.h1+=1
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if tag=='meta' and a.get('name')=='robots':self.robots.append(a.get('content',''))
  if tag=='script' and a.get('type')=='application/ld+json':self.inscript=True;self.text=''
  for attr in ('href','src','poster'):
   if a.get(attr) and (tag!='link' or 'canonical' not in a.get('rel','')):self.refs.append((tag,attr,a[attr]))
  if a.get('srcset') and not a['srcset'].startswith('data:'):
   for item in a['srcset'].split(','):self.refs.append((tag,'srcset',item.strip().split(' ')[0]))
 def handle_data(self,data):
  if self.inscript:self.text+=data
 def handle_endtag(self,tag):
  if tag=='script' and self.inscript:self.jsonld.append(self.text);self.inscript=False
pages={}
for f in DIST.rglob('*.html'):
 p=Parser();p.feed(f.read_text());pages[f]=p
rules={}
for line in (ROOT/'docs/.vuepress/public/_redirects').read_text().splitlines():
 a=line.strip().split()
 if a and not a[0].startswith('#'):rules[a[0]]=(a[1],int(a[2]))
def mapped(path):
 seen=set()
 while path in rules:
  if path in seen:return None,'redirect-loop'
  seen.add(path);path=rules[path][0]
 p=DIST/unquote(path.lstrip('/'))
 if p.is_file():return p,None
 for alt in (p/'index.html',Path(str(p)+'.html')):
  if alt.is_file():return alt,None
 return None,'missing-target'
issues=[]; warnings=[]; count=0; fragcount=0; oldlinks=[]
for f,p in pages.items():
 rel=str(f.relative_to(DIST));base=p.canonical[0] if p.canonical else 'https://yp7.net/'+rel.removesuffix('index.html')
 duplicates=[x for x,n in Counter(p.ids).items() if n>1]
 if duplicates:issues.append({'source':rel,'kind':'duplicate-id','ids':duplicates})
 if p.h1!=1:
  (warnings if any('noindex' in x for x in p.robots) else issues).append({'source':rel,'kind':'h1-count','count':p.h1,'noindex':any('noindex' in x for x in p.robots)})
 if len(p.canonical)!=1:issues.append({'source':rel,'kind':'canonical-count','count':len(p.canonical)})
 if len(p.robots)!=1:issues.append({'source':rel,'kind':'robots-count','count':len(p.robots)})
 for raw in p.jsonld:
  try:json.loads(raw)
  except Exception as e:issues.append({'source':rel,'kind':'invalid-jsonld','error':str(e)})
 if not p.jsonld:issues.append({'source':rel,'kind':'missing-jsonld'})
 for tag,attr,ref in p.refs:
  if ref.startswith(('data:','mailto:','tel:','javascript:','blob:')):continue
  u=urlsplit(urljoin(base,ref))
  if u.netloc not in ('yp7.net','www.yp7.net'):continue
  count+=1
  if u.path in rules and tag=='a':oldlinks.append({'source':rel,'ref':ref})
  target,error=mapped(u.path)
  if error:issues.append({'source':rel,'kind':error,'tag':tag,'attr':attr,'ref':ref});continue
  if u.fragment and target in pages and tag=='a':
   fragment=unquote(u.fragment).split(':~:text=')[0]
   if not fragment:continue
   fragcount+=1
   if fragment not in pages[target].ids:issues.append({'source':rel,'kind':'missing-fragment','ref':ref,'target':str(target.relative_to(DIST))})
# CSS asset URLs resolve relative to stylesheets.
cssrefs=0
for f in DIST.rglob('*.css'):
 for ref in re.findall(r'url\(\s*[\'\"]?([^\)\'\"]+)',f.read_text()):
  if ref.startswith(('data:','http:','https:','#','var(')):continue
  cssrefs+=1
  path=unquote(urlsplit(ref).path)
  target=DIST/path.lstrip('/') if path.startswith('/') else f.parent/path
  if not target.is_file():issues.append({'source':str(f.relative_to(DIST)),'kind':'missing-css-resource','ref':ref})
# Sitemap must contain current, canonical, indexable resources.
sitemap=ET.parse(DIST/'sitemap.xml');locs=[x.text for x in sitemap.iter() if x.tag.endswith('loc')]
for loc in locs:
 u=urlsplit(loc);f,error=mapped(u.path)
 if error or u.path in rules:issues.append({'source':'sitemap.xml','kind':'invalid-sitemap-target','ref':loc});continue
 if f not in pages:issues.append({'source':'sitemap.xml','kind':'non-html-sitemap','ref':loc});continue
 p=pages[f]
 if p.canonical!=[loc] or any('noindex' in x for x in p.robots):issues.append({'source':'sitemap.xml','kind':'noncanonical-or-noindex-sitemap','ref':loc,'canonical':p.canonical,'robots':p.robots})
canonical_locs=set(locs)
for f,p in pages.items():
 if not any('noindex' in x for x in p.robots) and p.canonical and p.canonical[0] not in canonical_locs:
  issues.append({'source':str(f.relative_to(DIST)),'kind':'indexable-page-missing-from-sitemap','canonical':p.canonical})
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*a,**kw):return None
opener=urllib.request.build_opener(NoRedirect)
def response(path):
 try:
  r=opener.open('http://127.0.0.1:8788'+path,timeout=10);return {'status':r.status,'location':r.headers.get('Location')}
 except urllib.error.HTTPError as r:return {'status':r.code,'location':r.headers.get('Location')}
 except Exception as e:return {'error':str(e)}
def redirect_check(item):
 source,(target,status)=item;r=response(source);t=response(target);return {'source':source,'expectedStatus':status,'expectedLocation':target,'actual':r,'targetResponse':t,'passed':r.get('status')==status and r.get('location') in [target,'http://127.0.0.1:8788'+target,'https://yp7.net'+target] and t.get('status')==200}
with ThreadPoolExecutor(max_workers=8) as ex:redirect_checks=list(ex.map(redirect_check,rules.items()))
deleted=[urlsplit(x.strip()).path for x in (ROOT/'.github/indexnow-deleted-urls.txt').read_text().splitlines() if x.startswith('https://')]
deleted_checks=[{'path':x,**response(x)} for x in deleted]
with ThreadPoolExecutor(max_workers=8) as ex:http_sitemap=[{'url':loc,**r} for loc,r in zip(locs,ex.map(lambda loc:response(urlsplit(loc).path),locs))]
result={'htmlFiles':len(pages),'checkedInternalReferences':count,'checkedFragments':fragcount,'cssResourceReferences':cssrefs,'sitemapUrls':len(locs),'issues':issues,'warnings':warnings,'legacyInternalLinks':oldlinks,'redirectChecks':redirect_checks,'deletedChecks':deleted_checks,'sitemapHttpIssues':[x for x in http_sitemap if x.get('status')!=200]}
(OUT/'static-crawl.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({**{k:result[k] for k in ['htmlFiles','checkedInternalReferences','checkedFragments','cssResourceReferences','sitemapUrls']},'issueCount':len(issues),'issues':issues[:25],'warnings':warnings,'legacyInternalLinks':len(oldlinks),'redirects':len(redirect_checks),'redirectFailures':[x for x in redirect_checks if not x['passed']],'deletedChecks':deleted_checks,'sitemapHttpIssues':result['sitemapHttpIssues']},ensure_ascii=False,indent=2))
