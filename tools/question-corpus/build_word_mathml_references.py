"""Research-only reference conversion using a locally licensed Office stylesheet.

Do not ship or copy the stylesheet, or depend on Office in the application.
The generated MathML is not clipboard evidence or a full-fidelity conversion pass.
"""
from pathlib import Path
import argparse
import hashlib
import json
import zipfile
from lxml import etree

parser = argparse.ArgumentParser()
parser.add_argument('--stylesheet', required=True, type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
manifest = json.loads((root / 'docs/reference/PUBLIC-QUESTION-SOURCES.json').read_text())
transform = etree.XSLT(etree.parse(str(args.stylesheet)), access_control=etree.XSLTAccessControl.DENY_ALL)
records = []
for sample in manifest['files']:
    data = (root / sample['local_path']).read_bytes()
    if hashlib.sha256(data).hexdigest() != sample['sha256']:
        raise ValueError('Public original changed')
    with zipfile.ZipFile(root / sample['local_path']) as package:
        document = etree.fromstring(package.read('word/document.xml'))
    for index, equation in enumerate(document.xpath('//*[local-name()="oMath"]'), 1):
        records.append({'id': f'{sample["id"]}-EQ-{index}', 'source_id': sample['id'],
                        'source_index': index, 'source_docx_sha256': sample['sha256'],
                        'mathml': str(transform(etree.ElementTree(equation))),
                        'status': 'reference_conversion_only_not_clipboard'})
destination = root / 'Project Files/Question Samples/clipboard-captures/public-native-mathml.json'
destination.parent.mkdir(exist_ok=True, parents=True)
destination.write_text(json.dumps({
    'notice': 'Research reference from locally installed Office stylesheet only; not copied or adopted as an application dependency. Not clipboard evidence.',
    'stylesheet_sha256': hashlib.sha256(args.stylesheet.read_bytes()).hexdigest(),
    'equations': records}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'reference_equations': len(records)}))
