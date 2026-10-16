"""Download pinned public MIT Word fixtures; inspect ZIP/XML without running Office.

Raw documents remain ignored. This is source intake, not a clipboard converter.
"""
from pathlib import Path
import hashlib
import base64
import json
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
REVISION = "431ab05cf160248cc3885a4a766026d4f8243792"
REPO = "dotnet/Open-XML-SDK"
PREFIX = "test/DocumentFormat.OpenXml.Tests.Assets/assets/TestDataStorage/"
SAMPLES = [
    ("PUB-01", PREFIX + "v2FxTestFiles/wordprocessing/equation/equation.docx"),
    ("PUB-02", PREFIX + "v2FxTestFiles/wordprocessing/equation/equation-1.docx"),
    ("PUB-03", PREFIX + "O14ISOStrict/Word/rSp-Row Spacing (Equation-Array Function)-val-1080.docx"),
]
DEST = ROOT / "Project Files/Question Samples/public-openxml"
DEST.mkdir(parents=True, exist_ok=True)


def fetch(path):
    url = f"https://api.github.com/repos/{REPO}/contents/" + urllib.parse.quote(path) + f"?ref={REVISION}"
    with urllib.request.urlopen(url, timeout=45) as response:
        record = json.load(response)
    if record.get("encoding") != "base64":
        raise ValueError("Expected a small base64 GitHub contents response")
    data = base64.b64decode(record["content"])
    if len(data) > 8_000_000:
        raise ValueError("Intake file exceeds 8 MB")
    return url, data


license_url, license_data = fetch("LICENSE")
if b"MIT License" not in license_data or b"Permission is hereby granted" not in license_data:
    raise ValueError("Repository license needs manual review")
(DEST / "LICENSE.txt").write_bytes(license_data)
records = []
for sample_id, source_path in SAMPLES:
    url, data = fetch(source_path)
    file = DEST / (sample_id + ".docx")
    file.write_bytes(data)
    with zipfile.ZipFile(file) as package:
        if sum(x.file_size for x in package.infolist()) > 32_000_000:
            raise ValueError("Expanded document exceeds intake bound")
        document = ET.fromstring(package.read("word/document.xml"))
        tags = {}
        for element in document.iter():
            if "math" in element.tag.split("}")[0]:
                name = element.tag.rsplit("}", 1)[-1]
                tags[name] = tags.get(name, 0) + 1
        ole_count = sum(e.tag.rsplit("}", 1)[-1] == "OLEObject" for e in document.iter())
        if not tags.get("oMath") and not ole_count:
            raise ValueError("Fixture contains neither native nor legacy OLE equations")
        external_relationships = 0
        for name in package.namelist():
            if name.endswith(".rels"):
                rels = ET.fromstring(package.read(name))
                external_relationships += sum(x.attrib.get("TargetMode") == "External" for x in rels)
        has_macros = any("vbaproject" in name.lower() for name in package.namelist())
    records.append({
        "id": sample_id, "kind": "public_upstream_docx_fixture",
        "repository": f"https://github.com/{REPO}", "revision": REVISION,
        "source_path": source_path, "download_url": url,
        "local_path": file.relative_to(ROOT).as_posix(), "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "license": "MIT (repository license; retained locally)",
        "license_url": license_url,
        "license_sha256": hashlib.sha256(license_data).hexdigest(),
        "intake_date": "2026-10-16", "inspection": "read-only ZIP/XML; no Office execution",
        "math_element_counts": tags, "external_relationship_count": external_relationships,
        "legacy_ole_object_count": ole_count,
        "vba_project_present": has_macros, "source_app_version": None,
        "visual_fidelity_verified": False, "clipboard_compatibility": "not_run",
        "mapped_cases": ["QC-019", "QC-038", "QC-040"] if tags.get("oMath") else ["QC-018", "QC-024"],
        "note": "Public software test fixture, not an owner question or verified Word clipboard sample.",
    })
report = {"prepared_on": "2026-10-16", "owner_authorized_public_substitutes": True,
          "owner_documents_received": 0, "public_docx_count": len(records),
          "public_native_equation_docx_count": sum(bool(x["math_element_counts"].get("oMath")) for x in records),
          "files": records, "clipboard_trials_executed": 0}
(ROOT / "docs/reference/PUBLIC-QUESTION-SOURCES.json").write_text(
    json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"downloaded": len(records), "native_equation_counts":
                  {x["id"]: x["math_element_counts"].get("oMath", 0) for x in records}}, indent=2))
