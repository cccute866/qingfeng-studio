#!/usr/bin/env python3
"""檢查 qingfeng-studio tokyo-live 分支的 live/tokyo_status.json 是否過期。

預設門檻 20 分鐘（1200 秒）。過期或讀不到就以非 0 結束，讓 GitHub Actions 失敗並寄信。
不讀、不需要任何自備秘密（可用 GitHub 自動提供的 GITHUB_TOKEN 拉檔，避免 raw 快取）。

用法：
  python3 check_tokyo_status.py --file path/to/tokyo_status.json --max-age 1200
  python3 check_tokyo_status.py --url URL --max-age 1200
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.request

TPE = dt.timezone(dt.timedelta(hours=8))


def parse_asof(raw) -> dt.datetime | None:
    s = str(raw or "").strip()
    if not s:
        return None
    s = s.replace("Z", "+00:00")
    if s.endswith("+0800"):
        s = s[:-5] + "+08:00"
    try:
        d = dt.datetime.fromisoformat(s)
    except ValueError:
        return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=TPE)
    return d


def load_status(path: str | None, url: str | None) -> dict:
    if path:
        return json.loads(open(path, encoding="utf-8").read())
    if not url:
        raise SystemExit("需要 --file 或 --url")
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github.raw, application/json"})
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read().decode("utf-8")
    return json.loads(body)


def age_seconds(as_of: dt.datetime, now: dt.datetime | None = None) -> float:
    now = now or dt.datetime.now(dt.timezone.utc)
    return (now - as_of.astimezone(dt.timezone.utc)).total_seconds()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", default="")
    ap.add_argument("--url", default=os.environ.get("STATUS_URL") or "")
    ap.add_argument("--max-age", type=int, default=int(os.environ.get("MAX_AGE_SECONDS") or "1200"))
    args = ap.parse_args(argv)
    try:
        data = load_status(args.file or None, args.url or None)
    except Exception as e:
        print(f"讀取失敗：{type(e).__name__}", file=sys.stderr)
        return 1
    as_of = parse_asof((data or {}).get("asOf"))
    if as_of is None:
        print("缺 asOf 或格式無法解析", file=sys.stderr)
        return 1
    age = age_seconds(as_of)
    label = as_of.astimezone(TPE).strftime("%Y-%m-%d %H:%M:%S") + " 台北"
    print(f"asOf={label} age_sec={age:.1f} max={args.max_age}")
    if age > args.max_age:
        print("過期：tokyo-live 狀態超過門檻未更新", file=sys.stderr)
        return 1
    if age < -120:
        print("asOf 在未來超過 2 分鐘，視為異常", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
