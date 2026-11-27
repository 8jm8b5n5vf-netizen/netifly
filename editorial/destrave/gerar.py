import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

folder = Path(__file__).resolve().parent
unit = json.loads((folder / "unidade-01.json").read_text(encoding="utf-8"))
target = folder.parents[1] / "public/previews/destrave-furto-e-roubo.pdf"
navy = HexColor("#101D32")
red = HexColor("#850D16")
fonts = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DejaVu", str(fonts / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", str(fonts / "DejaVuSans-Bold.ttf")))

def style(name, font, size, leading, color):
    return ParagraphStyle(name, fontName=font, fontSize=size, leading=leading,
                          textColor=color, alignment=TA_LEFT)

title = style("Title", "DejaVu-Bold", 34, 39, navy)
heading = style("Heading", "DejaVu-Bold", 22, 27, red)
label = style("Label", "DejaVu-Bold", 12, 16, red)
body = style("Body", "DejaVu", 12, 17, navy)
story = []

for index, page in enumerate(unit["pages"]):
    if index:
        story.append(PageBreak())
    story.extend([Paragraph("DESTRAVE O CÓDIGO PENAL  /  UNIDADE-MODELO", label),
                  Spacer(1, 15), Paragraph(unit["title"], title), Spacer(1, 12),
                  Paragraph(escape(page["title"]), heading), Spacer(1, 22)])
    for name, content in page["blocks"]:
        story.extend([Paragraph(escape(name), label),
                      Paragraph(escape(content).replace("\n", "<br/>"), body),
                      Spacer(1, 16)])
    if index == len(unit["pages"]) - 1:
        story.append(Paragraph('<link href="https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-2848-7-dezembro-1940-412868-normaatualizada-pe.html" color="#850D16">Consultar o Código Penal na Câmara dos Deputados</link>', body))

def footer(canvas, doc):
    canvas.setFillColor(navy)
    canvas.rect(0, 0, A4[0], 39, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#ffffff"))
    canvas.setFont("DejaVu-Bold", 9)
    canvas.drawString(45, 15, "CÓDIGO PENAL 360  •  EDIÇÃO PARA REVISÃO")
    canvas.drawRightString(A4[0] - 45, 15, str(doc.page))

SimpleDocTemplate(str(target), pagesize=A4, topMargin=48, bottomMargin=56,
                  leftMargin=45, rightMargin=45, title="Destrave o Código Penal — Furto e roubo",
                  author="Código Penal 360").build(story, onFirstPage=footer, onLaterPages=footer)
