from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
html=(BASE/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','').replace('<script src="core.js" defer></script><script src="app.js" defer></script>','')
css=(BASE/'styles.css').read_text()
core=(BASE/'core.js').read_text()
app=(BASE/'app.js').read_text()
def load(page):
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=css)
    page.add_script_tag(content=core)
    page.add_script_tag(content=app)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    all_errors=[]
    for width in [280,320,375,430,768,1024,1440]:
        page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1,accept_downloads=True)
        errors=[]
        
        page.on('pageerror',lambda e: errors.append(str(e)))
        load(page)
        page.wait_for_timeout(250)
        h=page.locator('h1').inner_text()
        assert 'AUTOMATION' in h
        sizes=page.evaluate('({doc:document.documentElement.scrollWidth, win:innerWidth})')
        assert sizes['doc']<=sizes['win']+1,('Horizontal overflow',width,sizes)
        assert not errors,(width,errors)
        if width<=768:
            page.locator('.menu-toggle').click()
            assert page.locator('#site-nav').evaluate('(e)=>e.classList.contains("open")')
            page.locator('#site-nav a[href="#lab"]').first.click()
            assert not page.locator('#site-nav').evaluate('(e)=>e.classList.contains("open")')
        if width in [375,1440]:
            page.screenshot(path=str(BASE/'tests'/f'screen_{width}.png'),full_page=True)
        print('WIDTH',width,'OK')
        page.close()
    page=browser.new_page(viewport={'width':1024,'height':850},accept_downloads=True)
    errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
    load(page)
    page.locator('#workflow-name').fill('Invoice routing')
    page.locator('#department').select_option('Finance')
    page.locator('#hours').fill('20')
    page.locator('#hourly').fill('25')
    page.locator('#sensitivity').select_option('high')
    page.locator('#action-type').select_option('external')
    page.locator('#workflow-form button[type="submit"]').click()
    page.wait_for_timeout(180)
    assert not page.locator('#result-content').is_hidden()
    assert '312h' in page.locator('#hours-saved').inner_text()
    assert '£7,800' in page.locator('#value-saved').inner_text()
    assert 'human approval' in page.locator('#checks').inner_text().lower()
    assert 'privacy/security' in page.locator('#checks').inner_text().lower()
    with page.expect_download() as dl:
        page.locator('#download-brief').click()
    download=dl.value
    assert download.suggested_filename=='titan-workflow-brief.txt'
    path=BASE/'tests'/'downloaded-brief.txt';download.save_as(path)
    text=path.read_text()
    assert 'Invoice routing' in text and '£7,800' in text and 'NOT A PROMISE' in text
    page.locator('#workflow-form button[type="reset"]').click()
    page.wait_for_timeout(60)
    assert page.locator('#result-content').is_hidden()
    page.locator('#workflow-form button[type="submit"]').click()
    assert not page.locator('#form-error').is_hidden()
    page.locator('#workflow-name').fill('<img src=x onerror=alert(7)>')
    page.locator('#workflow-form button[type="submit"]').click()
    assert '<img' in page.locator('#result-name').inner_text()
    assert page.locator('#result-name img').count()==0
    assert not errors,errors
    print('INTERACTIONS OK; downloaded brief, input safety, reset, validation')
    browser.close()
