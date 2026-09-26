"""Generate an ATS-friendly, two-page resume from the same content as the site."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'site/content.json').read_text(encoding='utf-8'))
INK = colors.HexColor('#102c36')
GREEN = colors.HexColor('#2d6557')
MUTED = colors.HexColor('#53646a')
def clean(text):
    return escape(text.replace('\u2013','-').replace('\u2014','-').replace('\u2019',"'"))
styles = {
    'name': ParagraphStyle('name',fontName='Helvetica-Bold',fontSize=29,leading=32,textColor=INK,spaceAfter=8),
    'subtitle': ParagraphStyle('subtitle',fontName='Helvetica',fontSize=10.5,leading=14,textColor=GREEN,spaceAfter=10),
    'contact': ParagraphStyle('contact',fontName='Helvetica',fontSize=8.5,leading=13,textColor=MUTED,spaceAfter=17),
    'section': ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=10,leading=15,textColor=GREEN,spaceBefore=17,spaceAfter=11),
    'role': ParagraphStyle('role',fontName='Helvetica-Bold',fontSize=12,leading=16,textColor=INK,spaceAfter=4),
    'meta': ParagraphStyle('meta',fontName='Helvetica',fontSize=9,leading=13,textColor=MUTED,spaceAfter=9),
    'body': ParagraphStyle('body',fontName='Helvetica',fontSize=9.4,leading=14.4,textColor=INK,spaceAfter=7),
    'bullet': ParagraphStyle('bullet',fontName='Helvetica',fontSize=9.4,leading=14.4,textColor=INK,leftIndent=10,firstLineIndent=-10,spaceAfter=7),
}
def para(text, style='body'):
    return Paragraph(text,styles[style])
def job(item):
    parts=[para(clean(item['company'])+' | '+clean(item['role']),'role'),para(clean(item['period'])+' &nbsp; / &nbsp; '+clean(item['focus']),'meta')]
    parts += [para('- '+clean(text),'bullet') for text in item['bullets']]
    parts.append(Spacer(1,9))
    return KeepTogether(parts)
def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#dbe2dc')); canvas.setLineWidth(.5); canvas.line(44,41,A4[0]-44,41)
    canvas.setFont('Helvetica',8);canvas.setFillColor(MUTED)
    canvas.drawString(44,27,'HAIYANG XU  /  SECURITY OPERATIONS & INCIDENT RESPONSE')
    canvas.drawRightString(A4[0]-44,27,f'{doc.page} / 2')

story=[para(clean(data['name']),'name'),para(clean(data['headline']),'subtitle'),
       para('<link href="mailto:'+data['email']+'">'+data['email']+'</link><br/>'+
            '<link href="'+data['linkedin']+'">linkedin.com/in/haiyang-xu-8a2151212</link> &nbsp; | &nbsp; '+
            '<link href="https://haiyangxu.netlify.app/">haiyangxu.netlify.app</link>','contact'),
       para(clean(data['summary'])),para('PROFESSIONAL EXPERIENCE','section')]
story.extend(job(item) for item in data['experience'][:3])
story.append(PageBreak())
story += [para('Haiyang Xu','role'),para('Experience, technical toolkit & education','meta'),para('EARLIER EXPERIENCE','section')]
story.extend(job(item) for item in data['experience'][3:])
story.append(para('TECHNICAL TOOLKIT','section'))
for group in data['toolkit']:
    story.append(para('<b>'+clean(group['title'])+':</b> '+clean(', '.join(group['items']))))
story.append(para('EDUCATION','section'))
for item in data['education']:
    story.append(KeepTogether([para(clean(item['school']),'role'),para(clean(item['degree'])+' | '+clean(item['period']),'meta'),para(clean(item['detail']))]))
story.append(para('CERTIFICATIONS','section'))
story.append(para(clean(' | '.join(data['certifications']))))
story.append(para('HACKATHONS','section'))
story.append(para('Deep Learning Week (2022): AI pedestrian and vehicle detection.<br/>Lyve Cloud Hackathon (2022): cloud-based media streaming server.'))
output=ROOT/'site/resume.pdf'
SimpleDocTemplate(str(output),pagesize=A4,rightMargin=44,leftMargin=44,topMargin=40,bottomMargin=55,title='Haiyang Xu - Resume',author='Haiyang Xu').build(story,onFirstPage=footer,onLaterPages=footer)
print(output)
