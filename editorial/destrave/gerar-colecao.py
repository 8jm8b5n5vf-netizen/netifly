"""Gera a edição de revisão em PDFs A4 e ZIP a partir dos arquivos editoriais."""
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "exportados"
NAVY = HexColor("#101D32")
RED = HexColor("#850D16")
GOLD = HexColor("#FFC928")
PAPER = HexColor("#F8F2E8")
WHITE = HexColor("#FFFFFF")
SOURCE = (
    "https://www2.camara.leg.br/legin/fed/declei/1940-1949/"
    "decreto-lei-2848-7-dezembro-1940-412868-normaatualizada-pe.html"
)
fonts = Path(os.environ.get("CP360_FONT_DIR", "/usr/share/fonts/truetype/dejavu"))
pdfmetrics.registerFont(TTFont("CP360", str(fonts / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("CP360-Bold", str(fonts / "DejaVuSans-Bold.ttf")))

cover_kicker = ParagraphStyle("Cover label", fontName="CP360-Bold", fontSize=12, leading=17, textColor=GOLD)
cover_title = ParagraphStyle("Cover title", fontName="CP360-Bold", fontSize=33, leading=39, textColor=WHITE)
cover_body = ParagraphStyle("Cover body", fontName="CP360", fontSize=13, leading=19, textColor=WHITE)
page_kicker = ParagraphStyle("Page label", fontName="CP360-Bold", fontSize=9, leading=13, textColor=RED)
page_title = ParagraphStyle("Page title", fontName="CP360-Bold", fontSize=22, leading=28, textColor=NAVY)
page_phase = ParagraphStyle("Page phase", fontName="CP360-Bold", fontSize=13, leading=19, textColor=RED)
label = ParagraphStyle("Block label", fontName="CP360-Bold", fontSize=10.5, leading=15, textColor=RED)
body = ParagraphStyle("Body", fontName="CP360", fontSize=10.5, leading=15, textColor=NAVY)

def read(name):
    return json.loads((ROOT / f"{name}.json").read_text(encoding="utf-8"))

def paragraph(text, style):
    return Paragraph(escape(text).replace("\n", "<br/>"), style)

def draw_page(canvas, doc):
    width, height = A4
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)
        canvas.setFillColor(RED)
        canvas.rect(width - 28, 0, 28, height, fill=1, stroke=0)
        canvas.setStrokeColor(GOLD)
        canvas.line(48, height - 89, width - 55, height - 89)
    else:
        canvas.setFillColor(PAPER)
        canvas.rect(0, height - 12, width, 12, fill=1, stroke=0)
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, width, 33, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("CP360-Bold", 8)
    canvas.drawString(48, 13, "CÓDIGO PENAL 360   /   EDIÇÃO PARA REVISÃO")
    canvas.drawRightString(width - 49, 13, str(doc.page))

def make_pdf(entry, group, documents, overview=False):
    filename = OUTPUT / f"{entry['id']}.pdf"
    story = [
        Spacer(1, 55),
        paragraph(f"DESTRAVE O CÓDIGO PENAL   /   {group}", cover_kicker),
        Spacer(1, 24),
        paragraph(entry["title"], cover_title),
        Spacer(1, 22),
        paragraph(entry["description"], cover_body),
    ]
    if overview:
        story.extend([Spacer(1, 22), paragraph("Coleção principal · 3 módulos · 9 unidades", cover_body)])
    if group.startswith("MÓDULO"):
        story.extend([Spacer(1, 32), paragraph("NESTE MÓDULO", cover_kicker)])
        for document in documents:
            story.extend([Spacer(1, 7), paragraph(document["title"], cover_body)])
    for document in documents:
        for page in document["pages"]:
            story.extend([
                PageBreak(),
                paragraph(group, page_kicker), Spacer(1, 6),
                paragraph(document["title"], page_title), Spacer(1, 4),
                paragraph(page["title"], page_phase), Spacer(1, 19),
            ])
            for title, text in page["blocks"]:
                story.append(KeepTogether([paragraph(title, label), paragraph(text, body), Spacer(1, 11)]))
    story.extend([
        Spacer(1, 6),
        Paragraph(f'<link href="{SOURCE}" color="#850D16">Fonte legal · Código Penal compilado na Câmara dos Deputados</link>', body),
    ])
    SimpleDocTemplate(
        str(filename), pagesize=A4, topMargin=43, bottomMargin=46,
        leftMargin=48, rightMargin=48, title=f"Destrave o Código Penal — {entry['title']}",
        author="Código Penal 360", invariant=1,
    ).build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    return filename

def main():
    collection = read("colecao")
    OUTPUT.mkdir(exist_ok=True)
    modules = [
        make_pdf(entry, f"MÓDULO {index:02}", [read(name) for name in entry["files"]], overview=index == 1)
        for index, entry in enumerate(collection["modulos"], start=1)
    ]
    bonuses = [make_pdf(entry, "MATERIAL DE REVISÃO", [read(entry["id"])]) for entry in collection["bonus"]]
    with ZipFile(OUTPUT / "destrave-o-codigo-penal.zip", "w", compression=ZIP_DEFLATED) as archive:
        for group, files in [("01-modulos", modules), ("02-materiais-de-revisao", bonuses)]:
            for file in files:
                archive.write(file, f"{group}/{file.name}")
    for file in [*modules, *bonuses]:
        print(file.name)

if __name__ == "__main__":
    main()
