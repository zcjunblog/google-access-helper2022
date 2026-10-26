"""Exercise catalog generation through its public CLI using isolated files."""

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "catalog.py"


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def extension(self, directory="旧版 扩展", **fields):
        manifest = {"name": "Example", "version": "1.0", "manifest_version": 2}
        manifest.update(fields)
        path = self.root / directory / "manifest.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(manifest), encoding="utf-8")
        return path.parent

    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--root", str(self.root), *args],
            cwd=self.temp.name,
            capture_output=True,
            text=True,
        )

    def generated(self):
        result = self.run_cli()
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads((self.root / "data/extensions.json").read_text(encoding="utf-8"))

    def test_extracts_versions_and_distinguishes_permission_groups(self):
        # Catches incorrectly merging optional access into required permissions.
        self.extension(
            "z-旧版", permissions=["proxy", "<all_urls>", "proxy"],
            optional_permissions=["tabs", "https://optional.example/*"],
            content_scripts=[{"matches": ["https://content.example/*"], "js": ["a.js"]}],
        )
        self.extension(
            "a-新版", manifest_version=3, version="2.0", permissions=["storage"],
            host_permissions=["https://required.example/*"],
            optional_host_permissions=["<all_urls>"],
        )
        catalog = self.generated()
        self.assertEqual(catalog["schema_version"], 1)
        self.assertEqual([e["directory"] for e in catalog["extensions"]], ["a-新版", "z-旧版"])
        modern, legacy = catalog["extensions"]
        self.assertEqual(modern["version"], "2.0")
        self.assertEqual(modern["chrome_status"], "mv3-declared-not-tested")
        self.assertEqual(modern["host_permissions"], ["https://required.example/*"])
        self.assertEqual(modern["optional_host_permissions"], ["<all_urls>"])
        self.assertEqual(legacy["chrome_status"], "unsupported-mv2")
        self.assertEqual(legacy["permissions"], ["proxy"])
        self.assertEqual(legacy["host_permissions"], ["<all_urls>"])
        self.assertEqual(legacy["optional_permissions"], ["tabs"])
        self.assertEqual(legacy["optional_host_permissions"], ["https://optional.example/*"])
        self.assertEqual(legacy["content_script_matches"], ["https://content.example/*"])

    def test_resolves_declared_locale_with_case_insensitive_keys(self):
        folder = self.extension(name="__MSG_ExtName__", default_locale="zh_CN")
        locale = folder / "_locales/zh_CN/messages.json"
        locale.parent.mkdir(parents=True)
        locale.write_text('{"extname": {"message": "本地化助手"}}', encoding="utf-8")
        self.assertEqual(self.generated()["extensions"][0]["name"], "本地化助手")

    def test_missing_localization_falls_back_to_directory(self):
        self.extension(name="__MSG_missing__", default_locale="en")
        self.assertEqual(self.generated()["extensions"][0]["name"], "旧版 扩展")

    def test_ignores_nested_manifests_and_sorts_deterministically(self):
        self.extension("z")
        self.extension("a")
        self.extension("tests/fixtures/not-an-extension")
        catalog = self.generated()
        self.assertEqual([e["directory"] for e in catalog["extensions"]], ["a", "z"])
        before = (self.root / "data/extensions.json").read_bytes()
        markdown = (self.root / "docs/extension-catalog.md").read_bytes()
        self.assertEqual(self.run_cli().returncode, 0)
        self.assertEqual((self.root / "data/extensions.json").read_bytes(), before)
        self.assertEqual((self.root / "docs/extension-catalog.md").read_bytes(), markdown)

    def test_markdown_escapes_names_and_encodes_links(self):
        self.extension(name="A | <img src=x>\n[click](https://example.org)")
        self.generated()
        markdown = (self.root / "docs/extension-catalog.md").read_text(encoding="utf-8")
        self.assertIn("../%E6%97%A7%E7%89%88%20%E6%89%A9%E5%B1%95/manifest.json", markdown)
        self.assertNotIn("<img", markdown)
        self.assertNotIn("[click](https://example.org)", markdown)
        self.assertIn("&#124;", markdown)

    def test_check_succeeds_for_current_output_and_never_rewrites(self):
        self.extension()
        self.generated()
        paths = [self.root / "data/extensions.json", self.root / "docs/extension-catalog.md"]
        before = [(p.read_bytes(), p.stat().st_mtime_ns) for p in paths]
        result = self.run_cli("--check")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([(p.read_bytes(), p.stat().st_mtime_ns) for p in paths], before)

    def test_check_detects_missing_and_each_stale_output(self):
        self.extension()
        result = self.run_cli("--check")
        self.assertEqual(result.returncode, 1)
        self.assertIn("data/extensions.json", result.stderr)
        self.assertFalse((self.root / "data").exists())
        self.generated()
        for relative in ("data/extensions.json", "docs/extension-catalog.md"):
            with self.subTest(relative=relative):
                path = self.root / relative
                path.write_text("stale", encoding="utf-8")
                result = self.run_cli("--check")
                self.assertEqual(result.returncode, 1)
                self.assertIn(relative, result.stderr)
                self.assertEqual(path.read_text(encoding="utf-8"), "stale")
                self.generated()

    def test_manifest_change_invalidates_catalog(self):
        folder = self.extension()
        self.generated()
        manifest = folder / "manifest.json"
        manifest.write_text('{"name":"Changed","version":"2","manifest_version":2}', encoding="utf-8")
        self.assertEqual(self.run_cli("--check").returncode, 1)

    def test_malformed_json_fails_without_overwriting_outputs(self):
        folder = self.extension()
        self.generated()
        paths = [self.root / "data/extensions.json", self.root / "docs/extension-catalog.md"]
        before = [p.read_bytes() for p in paths]
        (folder / "manifest.json").write_text("{broken", encoding="utf-8")
        result = self.run_cli()
        self.assertEqual(result.returncode, 2)
        self.assertIn("manifest.json", result.stderr)
        self.assertNotIn("Traceback", result.stderr)
        self.assertEqual([p.read_bytes() for p in paths], before)

    def test_invalid_manifest_fields_report_the_manifest_path(self):
        for field in (
            {"manifest_version": 4}, {"manifest_version": True}, {"version": None},
            {"permissions": "proxy"}, {"host_permissions": [True]},
            {"content_scripts": "bad"}, {"content_scripts": [{"matches": 12}]},
            {"default_locale": "../../outside"},
        ):
            with self.subTest(field=field):
                self.extension(**field)
                result = self.run_cli()
                self.assertEqual(result.returncode, 2, result.stdout)
                self.assertIn("manifest.json", result.stderr)
                self.assertIn("错误", result.stderr)
                self.assertNotIn("Traceback", result.stderr)
                self.assertFalse((self.root / "data").exists())

    def test_empty_input_is_an_error(self):
        result = self.run_cli()
        self.assertEqual(result.returncode, 2)
        self.assertIn("未找到", result.stderr)
        self.assertFalse((self.root / "data").exists())

    def test_embedded_extension_key_is_not_exported(self):
        self.extension(key="DO-NOT-EXPORT-THIS-KEY")
        self.generated()
        self.assertNotIn("DO-NOT-EXPORT-THIS-KEY", (self.root / "data/extensions.json").read_text())


if __name__ == "__main__":
    unittest.main()
