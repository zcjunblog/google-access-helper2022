#!/usr/bin/env python3
"""Validate and package the unpacked MV3 extension using only the standard library."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import zipfile


ROOT = Path(__file__).resolve().parents[1]


def package(source, output):
    source = source.resolve()
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    version = manifest.get("version", "")
    if manifest.get("manifest_version") != 3 or not re.fullmatch(r"\d+\.\d+\.\d+", version):
        raise ValueError("需要有效的 MV3 manifest 与三段式版本号。")
    required = {"manifest.json", manifest["background"]["service_worker"], manifest["action"]["default_popup"]}
    required.update(manifest.get("icons", {}).values())
    files = sorted(p for p in source.rglob("*") if p.is_file() and not any(part.startswith(".") for part in p.relative_to(source).parts))
    for path in files:
        if path.is_symlink():
            raise ValueError("不打包符号链接：{}".format(path))
        if path.suffix == ".mjs":
            for target in re.findall(r"from\s+['\"](\.[^'\"]+)['\"]", path.read_text(encoding="utf-8")):
                required.add(str((path.parent / target).resolve().relative_to(source)))
        if path.suffix == ".html":
            for target in re.findall(r"<(?:script|link)\b[^>]*(?:src|href)=['\"]([^'\"]+)['\"]", path.read_text(encoding="utf-8")):
                required.add(str((path.parent / target).resolve().relative_to(source)))
    for name in sorted(required):
        target = (source / name).resolve()
        if not target.is_relative_to(source) or not target.is_file():
            raise ValueError("缺少运行文件或路径无效：{}".format(name))
    output.mkdir(parents=True, exist_ok=True)
    archive = output / ("google-access-helper-" + version + ".zip")
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipped:
        for path in files:
            info = zipfile.ZipInfo("google-access-helper/" + path.relative_to(source).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            zipped.writestr(info, path.read_bytes(), compresslevel=9)
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (output / "SHA256SUMS").write_text(digest + "  " + archive.name + "\n", encoding="utf-8")
    return archive


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "extension")
    parser.add_argument("--out-dir", type=Path, default=ROOT / "dist")
    args = parser.parse_args()
    try:
        archive = package(args.source, args.out_dir)
        print("已生成 {} 与 SHA256SUMS".format(archive))
        return 0
    except (OSError, ValueError, KeyError, TypeError) as error:
        print("打包失败：{}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
