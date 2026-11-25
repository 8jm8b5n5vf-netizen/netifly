"""Regenerate the original cover art, WebP compositions and printable A4 samples."""
import json
import os
from pathlib import Path

import fitz
import numpy as np
from PIL import Image, ImageColor, ImageDraw, ImageFilter, ImageFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets'
EDITORIAL = Path(__file__).parent
FONTS = Path(os.environ.get('CP360_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
SANS = FONTS / 'DejaVuSans.ttf'
BOLD = FONTS / 'DejaVuSans-Bold.ttf'
SERIF = FONTS / 'DejaVuSerif-Bold.ttf'
SOURCE = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm'
DATE = '25/11/2026'
NAVY, GOLD, INK = '#111827', '#efd08a', '#344054'
TONES = {'red': '#8f2a24', 'blue': '#304d74', 'teal': '#276255'}
ARTICLES = json.loads((ROOT / 'src/content/samples.json').read_text())
CATALOG = {
    'livro': ('Código Penal', '360', 'Lei, exemplos e esquemas visuais', '#18253d', '#eac47e', 'scale'),
    'mapas': ('Mapas Mentais', 'Ilustrados', 'Organize os conceitos', '#922d31', '#f5d2a5', 'map'),
    'questoes': ('Questões', 'Comentadas', 'Pratique o raciocínio', '#203451', '#ead19a', 'list'),
    'flashcards': ('Flashcards', 'Jurídicos', 'Revisão ativa', '#286356', '#e5ddb5', 'flash'),
    'guia': ('Guia de Penas', 'e Crimes', 'Consulte por dispositivo', '#243f65', '#e6c987', 'grid'),
    'pegadinhas': ('Pegadinhas', 'de Direito Penal', 'Distinções para revisar', '#8a4930', '#f3d494', 'warn'),
    'simulados': ('Simulados', 'Completos', 'Treine para a prova', '#245248', '#e6d6a1', 'list'),
    'plano': ('Plano de', 'Estudos', 'Leitura, prática e revisão', '#4c456c', '#e7cfaa', 'grid'),
}

for name, font in [('Body', SANS), ('Bold', BOLD), ('Serif', SERIF)]:
    pdfmetrics.registerFont(TTFont(name, str(font)))


def text_lines(text, face, size, space):
    lines = []
    line = ''
    for word in text.split():
        phrase = (line + ' ' + word).strip()
        if pdfmetrics.stringWidth(phrase, face, size) > space and line:
            lines.append(line)
            line = word
        else:
            line = phrase
    return [*lines, line]


def pdf_assets():
    file = ROOT / 'public/previews/codigo-penal-360-amostras.pdf'
    c = Canvas(str(file), pagesize=A4, pageCompression=1)
    c.setTitle('Código Penal 360 — Amostras demonstrativas')
    c.setAuthor('Código Penal 360')
    c.setSubject('Amostras educacionais de Direito Penal com índice e exercícios')
    width, height = A4
    margin = 48
    full = width - 2 * margin

    def label(x, y, text, color=NAVY, face='Bold', size=10):
        c.setFillColor(HexColor(color))
        c.setFont(face, size)
        c.drawString(x, y, text)

    def paragraph(y, text, x=margin, space=full, face='Body', size=10.5, leading=15, color=INK):
        for line in text_lines(text, face, size, space):
            label(x, y, line, color, face, size)
            y -= leading
        return y

    def rule(y, color='#e0ded8'):
        c.setStrokeColor(HexColor(color))
        c.setLineWidth(.75)
        c.line(margin, y, width - margin, y)

    def footer(number, index=True):
        rule(52)
        label(margin, 36, 'Código Penal 360  /  Material educacional demonstrativo', INK, 'Body', 8)
        c.setFont('Bold', 8)
        c.drawRightString(width - margin, 36, f'{number:02d} / {len(ARTICLES)+1:02d}')
        if index:
            label(margin, 69, '← Voltar ao índice', '#236044', 'Bold', 8)
            c.linkRect('', 'indice', (margin, 66, margin + 100, 82), relative=0, thickness=0)

    c.bookmarkPage('indice')
    c.addOutlineEntry('Índice', 'indice', level=0)
    c.setFillColor(HexColor(NAVY))
    c.rect(0, height - 215, width, 215, stroke=0, fill=1)
    label(margin, height - 58, 'EDIÇÃO DEMONSTRATIVA  /  DIREITO PENAL', GOLD, 'Bold', 10)
    label(margin, height - 117, 'Código Penal 360', '#ffffff', 'Serif', 39)
    label(margin, height - 149, 'Lei em 5 Camadas', GOLD, 'Bold', 17)
    label(margin, height - 171, 'Leia  ·  Entenda  ·  Visualize  ·  Pratique  ·  Memorize', '#ffffff', 'Body', 10)
    y = height - 256
    label(margin, y, 'Índice das amostras', NAVY, 'Bold', 19)
    y = paragraph(y - 25, 'Toque no artigo para abrir a página. Leia o trecho legal e tente resolver o exercício antes de conferir a resposta.', size=11) - 12
    for page, art in enumerate(ARTICLES, 2):
        rule(y + 10)
        label(margin, y - 10, f'ART. {art["id"]}', TONES[art['tone']], 'Bold', 9)
        label(margin + 90, y - 10, art['title'], NAVY, 'Bold', 11)
        label(width - margin - 21, y - 10, f'{page:02d}', INK, 'Bold', 9)
        c.linkRect('', f'art-{art["id"]}', (margin, y - 19, width - margin, y + 10), relative=0, thickness=0)
        y -= 34
    y = paragraph(y - 15, 'Trechos do Decreto-Lei nº 2.848/1940, versão compilada do Planalto consultada em ' + DATE + '. As explicações, os esquemas e os exercícios são exemplos educacionais. Revisão jurídica especializada pendente.', size=9, leading=13)
    label(margin, y - 2, 'Abrir a versão compilada no Planalto', '#236044', 'Bold', 9)
    c.linkURL(SOURCE, (margin, y - 5, margin + 210, y + 10), relative=0, thickness=0)
    footer(1, index=False)
    c.showPage()

    for number, art in enumerate(ARTICLES, 2):
        article = art['id']
        tone = TONES[art['tone']]
        c.bookmarkPage(f'art-{article}')
        c.addOutlineEntry(f'Art. {article} — {art["title"]}', f'art-{article}', level=0)
        c.setFillColor(HexColor(NAVY))
        c.rect(0, height - 38, width, 38, fill=1, stroke=0)
        label(margin, height - 24, 'CÓDIGO PENAL 360  /  LEI EM 5 CAMADAS', '#ffffff', 'Bold', 8)
        label(width - margin - 86, height - 24, 'DEMONSTRAÇÃO', GOLD, 'Bold', 8)
        label(margin, height - 68, f'ART. {article}  /  {art["group"].upper()}', tone, 'Bold', 9)
        label(margin, height - 103, art['title'], NAVY, 'Serif', 27)
        y = height - 130
        excerpt_tag = {14: 'INCISO II', 18: 'INCISO I', 23: 'CAPUT E INCISOS'}.get(article, 'CAPUT')
        sections = [
            ('01   LEIA · TRECHO DA LEI / ' + excerpt_tag, art['law']),
            ('02   ENTENDA · EM LINGUAGEM SIMPLES', art['plain']),
            ('CONCEITOS FUNDAMENTAIS', art['concept']),
        ]
        for heading, value in sections:
            rule(y + 9)
            label(margin, y - 8, heading, tone, 'Bold', 9)
            y = paragraph(y - 27, value) - 7

        label(margin, y - 4, '03   VISUALIZE · ESQUEMA', tone, 'Bold', 9)
        gap = 17
        box = (full - 2 * gap) / 3
        for step_index, step in enumerate(art['steps']):
            x = margin + (box + gap) * step_index
            c.setFillColor(HexColor('#edf1f1'))
            c.roundRect(x, y - 48, box, 34, 4, fill=1, stroke=0)
            lines = text_lines(step, 'Bold', 9, box - 12)
            for i, line in enumerate(lines):
                c.setFont('Bold', 9)
                c.setFillColor(HexColor(NAVY))
                c.drawCentredString(x + box / 2, y - 34 + (len(lines) - 1) * 5 - i * 10, line)
            if step_index < 2:
                arrow = '→' if article != 18 or step_index == 1 else '/'
                label(x + box + 4, y - 34, arrow, tone, 'Bold', 9)
        y -= 67
        for heading, value in [('EXEMPLO DIDÁTICO', art['example']), ('ERRO COMUM', art['trap']), ('04   PRATIQUE · EXERCÍCIO DE FIXAÇÃO', art['question']), ('05   MEMORIZE · RESPOSTA COMENTADA', art['answer'])]:
            label(margin, y, heading, tone, 'Bold', 9)
            y = paragraph(y - 16, value) - 5
        if y < 105:
            raise ValueError(f'Art. {article} ultrapassa a área editorial')
        label(margin, 91, 'Fonte: Decreto-Lei nº 2.848/1940, compilado no Planalto · Consulta: ' + DATE, '#236044', 'Body', 8)
        c.linkURL(SOURCE, (margin, 88, width - margin, 101), relative=0, thickness=0)
        footer(number)
        c.showPage()
    c.save()
    with fitz.open(file) as source:
        for page, art in zip(list(source)[1:], ARTICLES):
            for size, label_name in [(520, 'card'), (1160, 'full')]:
                render = page.get_pixmap(matrix=fitz.Matrix(size / page.rect.width, size / page.rect.width), alpha=False)
                image = Image.frombytes('RGB', (render.width, render.height), render.samples)
                image.resize((size, round(size * 1.414)), Image.Resampling.LANCZOS).save(
                    ASSETS / f'previews/art-{art["id"]}-{label_name}.webp', quality=88, method=6)


def font(family, size):
    return ImageFont.truetype(str(family), size)


def mixed(a, b, balance):
    return tuple(round(x * (1 - balance) + y * balance) for x, y in zip(ImageColor.getrgb(a), ImageColor.getrgb(b)))


def symbol(draw, name, origin, size, color, width=3):
    x, y = origin

    def path(points, line=width):
        draw.line([(x + size * px, y + size * py) for px, py in points], fill=color, width=line, joint='curve')

    def circle(cx, cy, radius):
        draw.ellipse((x + (cx - radius)*size, y + (cy - radius)*size,
                      x + (cx + radius)*size, y + (cy + radius)*size), outline=color, width=width)

    if name == 'scale':
        path([(.5,.12),(.5,.85),(.29,.85),(.71,.85)])
        path([(.13,.28),(.50,.19),(.87,.28)])
        for center in [.21, .79]:
            path([(center,.26),(center-.15,.60),(center+.15,.60),(center,.26)])
            draw.arc((x+(center-.15)*size,y+.45*size,x+(center+.15)*size,y+.75*size),0,180,fill=color,width=width)
        circle(.5,.16,.045)
    elif name == 'map':
        for xx, yy in [(.17,.2),(.85,.18),(.8,.84),(.19,.79)]:
            path([(.5,.5),(xx,yy)])
            circle(xx,yy,.09)
        circle(.5,.5,.16)
    elif name == 'flash':
        path([(.14,.24),(.8,.24),(.8,.76),(.14,.76),(.14,.24)])
        path([(.25,.24),(.25,.13),(.9,.13),(.9,.65),(.8,.65)])
        path([(.46,.33),(.35,.53),(.52,.53),(.42,.68)])
    elif name == 'grid':
        for xx in [.18,.43,.68]:
            for yy in [.15,.39,.63]:
                path([(xx,yy),(xx+.16,yy),(xx+.16,yy+.16),(xx,yy+.16),(xx,yy)])
    elif name == 'warn':
        path([(.5,.1),(.91,.77),(.09,.77),(.5,.1)])
        path([(.5,.32),(.5,.56)])
        circle(.5,.66,.025)
    else:
        for yy in [.25,.48,.71]:
            path([(.12,yy),(.20,yy+.06),(.31,yy-.07)])
            path([(.41,yy),(.88,yy)])


def cover(key):
    first, second, subtitle, base, gold, icon = CATALOG[key]
    img = Image.new('RGB', (680, 960), base)
    noise = Image.effect_noise(img.size, 13).convert('RGB')
    img = Image.blend(img, noise, .10)
    draw = ImageDraw.Draw(img)
    detail = mixed(base, gold, .45)
    for pad in [35, 42]:
        draw.rectangle((pad, pad, 680-pad, 960-pad), outline=detail, width=2)
    draw.rectangle((0, 0, 17, 960), fill=mixed(base, '#000000', .3))
    draw.line((57, 117, 623, 117), fill=detail, width=2)
    draw.text((63, 74), 'CÓDIGO PENAL 360' if key != 'livro' else 'DIREITO PENAL  /  EDIÇÃO DIGITAL', font=font(BOLD, 20), fill=gold, anchor='lt')
    if key == 'livro':
        draw.text((62, 156), first, font=font(SERIF, 75), fill='#fff5df', anchor='lt')
        draw.text((52, 235), second, font=font(SERIF, 206), fill=gold, anchor='lt')
        cx, cy, radius = 340, 618, 142
        for diff in (0, 9, 19):
            r = radius - diff
            draw.ellipse((cx-r, cy-r, cx+r, cy+r), outline=detail, width=2)
        for q in range(0, 360, 30):
            import math
            p = math.radians(q)
            draw.line((cx+radius*math.cos(p),cy+radius*math.sin(p),cx+(radius+22)*math.cos(p),cy+(radius+22)*math.sin(p)), fill=detail, width=2)
        symbol(draw, icon, (cx-89, cy-91), 178, gold, 5)
        draw.text((340, 807), 'LEI EM 5 CAMADAS', font=font(BOLD, 29), fill=gold, anchor='mt')
        draw.text((340, 863), subtitle, font=font(SANS, 23), fill='#fff5df', anchor='mt')
    else:
        draw.text((62, 169), first, font=font(SERIF, 54), fill='#fff5df', anchor='lt')
        draw.text((62, 235), second, font=font(SERIF, 46), fill=gold, anchor='lt')
        draw.ellipse((180, 381, 500, 701), outline=detail, width=2)
        draw.ellipse((197, 398, 483, 684), outline=detail, width=2)
        symbol(draw, icon, (220, 420), 240, gold, 7)
        draw.line((65, 764, 615, 764), fill=detail, width=2)
        draw.text((62, 803), subtitle, font=font(SANS, 28), fill='#fff5df', anchor='lt')
        draw.text((62, 863), 'MÉTODO LEI EM 5 CAMADAS', font=font(BOLD, 17), fill=gold, anchor='lt')
    img.save(EDITORIAL / 'covers' / (key + '.png'), optimize=True)
    img.save(ASSETS / 'covers' / (key + '.webp'), quality=90, method=6)
    return img


def projected(scene, img, field, thickness=0, shade=65):
    """Project a front cover onto a quadrilateral, then add page edges and shadow."""
    w, h = scene.size
    quad = [(int(x), int(y)) for x, y in field]
    shift = (thickness, thickness // 2)
    back = [(x+shift[0], y+shift[1]) for x, y in quad]
    shadow = Image.new('RGBA', scene.size)
    sd = ImageDraw.Draw(shadow)
    sd.polygon([(x+16, y+26) for x,y in back], fill=(29, 23, 28, shade))
    scene.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(max(5, thickness // 2 + 7))))
    if thickness:
        d = ImageDraw.Draw(scene)
        d.polygon([quad[1], back[1], back[2], quad[2]], fill='#d7cab0')
        d.polygon([quad[3], quad[2], back[2], back[3]], fill='#e8dbc0')
        for n in range(3, thickness, 5):
            dx, dy = n, shift[1] * n / thickness
            d.line((quad[1][0]+dx,quad[1][1]+dy,quad[2][0]+dx,quad[2][1]+dy),fill='#b5aa96',width=1)
            d.line((quad[3][0]+dx,quad[3][1]+dy,quad[2][0]+dx,quad[2][1]+dy),fill='#cbc0ab',width=1)

    left, top = min(x for x,y in quad), min(y for x,y in quad)
    right, bottom = min(w,max(x for x,y in quad)), min(h,max(y for x,y in quad))
    local = [(x-left, y-top) for x,y in quad]
    original = [(0,0),(img.width,0),(img.width,img.height),(0,img.height)]
    matrix, results = [], []
    for (x,y),(u,v) in zip(local, original):
        matrix.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]])
        results.extend([u,v])
    coeff = np.linalg.solve(matrix, results)
    face = img.convert('RGBA').transform((right-left, bottom-top), Image.Transform.PERSPECTIVE, coeff, resample=Image.Resampling.BICUBIC)
    scene.alpha_composite(face, (left, top))


def webp(image, path, quality=89):
    image.save(ASSETS / path, quality=quality, method=6)


def mockups(covers):
    scene = Image.new('RGBA', (1300,1230))
    d = ImageDraw.Draw(scene)
    d.ellipse((108, 52, 1216, 1160), fill=(226, 207, 174, 68))
    for ring in [25,51,74]:
        d.ellipse((108+ring,52+ring,1216-ring,1160-ring), outline=(162,126,66,72),width=2)
    d.line((655, 48, 655, 1160), fill=(151,117,65,60),width=2)
    d.line((103, 604, 1219, 604), fill=(151,117,65,60),width=2)
    d.ellipse((647, 40, 663, 56), fill='#a97f40')
    d.ellipse((95, 596, 111, 612), fill='#a97f40')
    d.ellipse((1211, 596, 1227, 612), fill='#a97f40')
    left_page = Image.open(ASSETS / 'previews/art-14-full.webp')
    right_page = Image.open(ASSETS / 'previews/art-18-full.webp')
    third_page = Image.open(ASSETS / 'previews/art-23-full.webp')
    projected(scene, third_page, [(182,271),(548,226),(608,827),(221,869)], 4, 42)
    projected(scene, left_page, [(111,339),(469,250),(605,847),(247,944)], 4, 72)
    projected(scene, right_page, [(872,225),(1199,350),(1010,904),(689,784)], 5, 58)
    projected(scene, covers['livro'], [(365,202),(857,165),(917,892),(421,966)], 37, 105)
    projected(scene, covers['guia'], [(901,613),(1126,707),(1014,1010),(793,922)], 15, 52)
    projected(scene, covers['mapas'], [(209,740),(438,693),(503,1037),(269,1093)], 18, 62)
    projected(scene, covers['questoes'], [(463,839),(661,839),(653,1106),(459,1100)], 16, 56)
    projected(scene, covers['simulados'], [(680,848),(864,879),(819,1131),(627,1099)], 14, 54)
    projected(scene, covers['plano'], [(921,887),(1076,931),(1017,1135),(858,1090)], 13, 46)
    for x, y in [(922,1013),(960,1028),(993,1044)]:
        projected(scene, covers['flashcards'], [(x,y),(x+139,y+30),(x+113,y+144),(x-22,y+108)], 7, 32)
    for name, dimensions in [('kit', scene.size), ('kit-medium', (850, 804)), ('kit-small', (650, 615))]:
        hero = scene.resize(dimensions, Image.Resampling.LANCZOS)
        webp(hero, f'hero/{name}.webp', 89 if name == 'kit' else 86)
        hero.save(ASSETS / f'hero/{name}.avif', quality=61, speed=6)

    single = Image.new('RGBA',(780,760))
    d = ImageDraw.Draw(single)
    for p in [38,64,87]:
        d.ellipse((p,p,780-p,760-p),outline=(226,203,151,63),width=2)
    projected(single, left_page, [(378,155),(678,190),(640,662),(329,619)], 5, 72)
    projected(single, covers['livro'], [(133,129),(501,87),(561,647),(188,704)], 35, 135)
    webp(single,'mockups/livro.webp')

    for index,(key,artwork) in enumerate(list(covers.items())[1:]):
        mockup = Image.new('RGBA',(480,380))
        d = ImageDraw.Draw(mockup)
        d.ellipse((105,35,375,350),outline=(119,94,63,62),width=2)
        if index % 2 == 0:
            quad = [(121,69),(300,32),(354,302),(169,343)]
        else:
            quad = [(160,35),(338,73),(291,342),(105,306)]
        projected(mockup, artwork, quad, 15, 80)
        webp(mockup,'mockups/' + key + '.webp')

    social = Image.new('RGBA',(1200,630),'#111827')
    d = ImageDraw.Draw(social)
    d.rectangle((48,48,1152,582),outline='#796445',width=2)
    d.text((89,129),'DIREITO PENAL EM LINGUAGEM SIMPLES',font=font(BOLD,19),fill=GOLD)
    d.text((84,201),'Código Penal',font=font(SERIF,56),fill='#fff5df')
    d.text((83,270),'360',font=font(SERIF,123),fill=GOLD)
    d.text((90,451),'Método Lei em 5 Camadas',font=font(SANS,27),fill='#fff5df')
    social.alpha_composite(single.resize((553,539),Image.Resampling.LANCZOS),(561,43))
    webp(social.convert('RGB'),'branding/social.webp')


if __name__ == '__main__':
    for folder in [EDITORIAL / 'covers', ROOT / 'public/previews', *(ASSETS / k for k in ['hero','mockups','covers','previews','branding'])]:
        folder.mkdir(exist_ok=True, parents=True)
    pdf_assets()
    mockups({key: cover(key) for key in CATALOG})
