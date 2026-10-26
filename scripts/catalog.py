#!/usr/bin/env python3
"""Build a deterministic inventory from manifests without running extensions."""

import argparse
import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import quote


DEFAULT_ROOT = Path(__file__).resolve().parents[1]


def read_object(path):
    try:
        value = json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, UnicodeError, ValueError) as error:
        raise ValueError("{}: {}".format(path, error)) from error
    if not isinstance(value, dict):
        raise ValueError("{}: JSON 顶层必须是对象".format(path))
    return value


def string_list(value, field, path):
    if not isinstance(value, list) or any(not isinstance(item, str) for item in value):
        raise ValueError("{}: {} 必须是字符串数组".format(path, field))
    return sorted(set(value))


def is_host_pattern(value):
    return value == "<all_urls>" or "://" in value


def extension_record(path):
    manifest = read_object(path)
    for field in ("name", "version"):
        if not isinstance(manifest.get(field), str) or not manifest[field].strip():
            raise ValueError("{}: {} 必须是非空字符串".format(path, field))
    mv = manifest.get("manifest_version")
    if type(mv) is not int or mv not in (2, 3):
        raise ValueError("{}: manifest_version 必须为 2 或 3".format(path))
    locale = manifest.get("default_locale", "")
    if not isinstance(locale, str) or (locale and not re.fullmatch(r"[a-zA-Z0-9_@-]+", locale)):
        raise ValueError("{}: default_locale 格式无效".format(path))
    minimum = manifest.get("minimum_chrome_version")
    if minimum is not None and not isinstance(minimum, str):
        raise ValueError("{}: minimum_chrome_version 必须是字符串".format(path))

    name = manifest["name"]
    message = re.fullmatch(r"__MSG_(.+)__", name)
    if message:
        name = path.parent.name
        messages_path = path.parent / "_locales" / locale / "messages.json"
        if locale and messages_path.is_file():
            messages = read_object(messages_path)
            entry = next((v for k, v in messages.items() if k.casefold() == message[1].casefold()), {})
            translated = entry.get("message") if isinstance(entry, dict) else None
            if isinstance(translated, str) and translated.strip():
                name = translated

    required = string_list(manifest.get("permissions", []), "permissions", path)
    optional = string_list(manifest.get("optional_permissions", []), "optional_permissions", path)
    hosts = string_list(manifest.get("host_permissions", []), "host_permissions", path)
    optional_hosts = string_list(
        manifest.get("optional_host_permissions", []), "optional_host_permissions", path
    )
    scripts = manifest.get("content_scripts", [])
    if not isinstance(scripts, list) or any(not isinstance(item, dict) for item in scripts):
        raise ValueError("{}: content_scripts 必须是对象数组".format(path))
    matches = []
    for script in scripts:
        matches.extend(string_list(script.get("matches", []), "content_scripts.matches", path))

    return {
        "directory": path.parent.name,
        "manifest_path": path.parent.name + "/manifest.json",
        "name": name,
        "version": manifest["version"],
        "manifest_version": mv,
        "minimum_chrome_version": minimum,
        "chrome_status": "unsupported-mv2" if mv == 2 else "mv3-declared-not-tested",
        "permissions": [p for p in required if not is_host_pattern(p)],
        "host_permissions": sorted(set(hosts + [p for p in required if is_host_pattern(p)])),
        "optional_permissions": [p for p in optional if not is_host_pattern(p)],
        "optional_host_permissions": sorted(set(optional_hosts + [p for p in optional if is_host_pattern(p)])),
        "content_script_matches": sorted(set(matches)),
    }


def build_catalog(root):
    records = [
        extension_record(folder / "manifest.json")
        for folder in sorted(root.iterdir(), key=lambda p: p.name)
        if folder.is_dir() and not folder.is_symlink()
        and not folder.name.startswith(".") and (folder / "manifest.json").is_file()
    ]
    if not records:
        raise ValueError("{}: 未找到一级目录中的 manifest.json".format(root))
    return {"schema_version": 1, "extensions": records}


def markdown_text(value):
    text = html.escape(str(value)).replace("\r", " ").replace("\n", " ")
    for character in "|[]`\\*_":
        text = text.replace(character, "&#{};".format(ord(character)))
    return text


def render_markdown(catalog):
    lines = [
        "# 扩展版本与权限清单", "",
        "> 由 `python3 scripts/catalog.py` 自动生成，请修改源 manifest 后重新生成。", "",
        "本页只读取仓库内的声明文件，不执行扩展、不连接服务、不构成安全审计。", "",
        "MV2 在当前 Chrome 中已不受支持；MV3 也仅表示声明的规范版本，未经本仓库运行验证。",
        "`minimum_chrome_version` 是原作者声明的历史最低版本，不代表今天仍然兼容。", "",
        "| 目录 / 源文件 | 扩展名称 | 版本 | Manifest | 当前 Chrome 状态 |",
        "| --- | --- | --- | --- | --- |",
    ]
    for record in catalog["extensions"]:
        status = "不支持（MV2）" if record["manifest_version"] == 2 else "MV3 声明，未实测"
        lines.append("| [{}](../{}) | {} | {} | {} | {} |".format(
            markdown_text(record["directory"]), quote(record["manifest_path"], safe="/"),
            markdown_text(record["name"]), markdown_text(record["version"]),
            record["manifest_version"], status,
        ))
    for record in catalog["extensions"]:
        lines.extend(["", "## " + markdown_text(record["directory"]), ""])
        lines.append("- 声明的最低 Chrome 版本：" + markdown_text(record["minimum_chrome_version"] or "未声明"))
        for field, label in (
            ("permissions", "必需 API 权限"),
            ("host_permissions", "必需主机访问范围"),
            ("optional_permissions", "可选 API 权限"),
            ("optional_host_permissions", "可选主机访问范围"),
            ("content_script_matches", "内容脚本 matches（未扣除 exclude_matches 等限制）"),
        ):
            values = "、".join(markdown_text(value) for value in record[field]) or "未声明"
            lines.append("- {}：{}".format(label, values))
    lines.extend([
        "", "## 如何理解这些声明", "",
        "- `proxy`：允许扩展管理浏览器代理设置。",
        "- `webRequest` / `webRequestBlocking`：涉及网络请求观察或拦截；迁移时需要逐项评估。",
        "- `management`：涉及其他扩展的信息或管理能力，具体操作仍受浏览器权限规则约束。",
        "- `<all_urls>` 或广泛的主机匹配：声明了较广的访问范围，并不直接证明扩展有恶意行为。",
        "- 声明清单不能证明服务可用、代码可信或隐私承诺已被验证。", "",
        "返回 [项目首页](../README.md) · [迁移与排错](migration.md)", "",
    ])
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT, help="仓库根目录，默认取脚本位置")
    parser.add_argument("--check", action="store_true", help="只检查生成文件是否缺失或过期，不写入文件")
    args = parser.parse_args(argv)
    try:
        root = args.root.resolve()
        catalog = build_catalog(root)
        outputs = {
            "data/extensions.json": json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
            "docs/extension-catalog.md": render_markdown(catalog),
        }
        if args.check:
            stale = [name for name, content in outputs.items()
                     if not (root / name).is_file() or (root / name).read_bytes() != content.encode("utf-8")]
            if stale:
                print("清单缺失或过期：{}；请运行 python3 scripts/catalog.py".format(", ".join(stale)), file=sys.stderr)
                return 1
            print("清单一致：{} 个扩展。".format(len(catalog["extensions"])))
            return 0
        for name, content in outputs.items():
            path = root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content.encode("utf-8"))
        print("已生成 {} 个扩展的 JSON 和 Markdown 清单。".format(len(catalog["extensions"])))
        return 0
    except (OSError, UnicodeError, ValueError) as error:
        print("错误：{}".format(error), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
