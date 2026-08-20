import os
import sys
import json
import time
from google import genai

# agy-ui-analizer — 2-bosqich (Orcestor zonasi).
#
# review_pages.js yaratgan pages.json manifestidagi HAR BIR sahifa
# screenshot'ini Gemini Vision API orqali tahlil qiladi va har biri uchun
# alohida gemini_response.md yozadi. Limitlar/throttling sababi:
# ../docs/design-rationale.md#6.
#
# Ishlatilishi:
#   python3 analyze_pages.py <OUTPUT_DIR> <PROMPT_MD_PATH> [ENV_PATH]


DEFAULT_CONFIG = {
    "GEMINI_RPM_LIMIT": "12",
    "GEMINI_MAX_REQUESTS_PER_RUN": "200",
    "GEMINI_RETRY_COUNT": "2",
    "GEMINI_RETRY_DELAY_SECONDS": "15",
}


def load_config(config_path):
    config = dict(DEFAULT_CONFIG)
    if config_path and os.path.exists(config_path):
        with open(config_path) as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    k = k.strip()
                    if k in DEFAULT_CONFIG:  # faqat shu skriptga tegishli, int qiymatli kalitlar
                        config[k] = v.strip().strip('"').strip("'")
    return {k: int(v) for k, v in config.items()}


def load_api_key(explicit_env_path=None):
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
    if api_key:
        return api_key
    candidates = []
    if explicit_env_path:
        candidates.append(explicit_env_path)
    candidates.append(os.path.join(os.getcwd(), ".env"))
    for env_path in candidates:
        if env_path and os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and "=" in line and not line.startswith("#"):
                        k, v = line.split("=", 1)
                        if k.lower() in ["gemini_api_key", "api_key", "google_api_key"]:
                            return v.strip().strip('"').strip("'")
    return None


def analyze_one(client, prompt_text, screenshot_path, output_path, retries, retry_delay_s):
    for attempt in range(retries + 1):
        try:
            uploaded = client.files.upload(file=screenshot_path)
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=[uploaded, prompt_text],
            )
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(response.text)
            return True, None
        except Exception as e:
            if attempt < retries:
                time.sleep(retry_delay_s)
                continue
            return False, str(e)


def main():
    if len(sys.argv) < 3:
        print("Ishlatilishi: python3 analyze_pages.py <OUTPUT_DIR> <PROMPT_MD_PATH> [ENV_PATH] [CONFIG_PATH]")
        sys.exit(1)

    output_dir = os.path.abspath(sys.argv[1])
    prompt_path = os.path.abspath(sys.argv[2])
    env_path = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else None
    config_path = os.path.abspath(sys.argv[4]) if len(sys.argv) > 4 else os.path.join(os.path.dirname(__file__), "..", "config.env")
    config = load_config(config_path)
    min_interval_s = 60.0 / config["GEMINI_RPM_LIMIT"]
    print(f"⚙️  Limitlar: RPM={config['GEMINI_RPM_LIMIT']} (min-interval {min_interval_s:.1f}s), "
          f"max-so'rov/ishga-tushirish={config['GEMINI_MAX_REQUESTS_PER_RUN']}, "
          f"retry={config['GEMINI_RETRY_COUNT']}x{config['GEMINI_RETRY_DELAY_SECONDS']}s")

    manifest_path = os.path.join(output_dir, "pages.json")
    if not os.path.exists(manifest_path):
        print(f"❌ Xatolik: {manifest_path} topilmadi — avval review_pages.js ishga tushirilishi kerak.")
        sys.exit(1)

    api_key = load_api_key(env_path)
    if not api_key:
        print("❌ Xatolik: hech qaysi manbada GEMINI_API_KEY topilmadi.")
        sys.exit(1)

    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_text = f.read()

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    client = genai.Client(api_key=api_key)

    if len(manifest) > config["GEMINI_MAX_REQUESTS_PER_RUN"]:
        print(f"⚠️  {len(manifest)} ta sahifa topildi, lekin GEMINI_MAX_REQUESTS_PER_RUN="
              f"{config['GEMINI_MAX_REQUESTS_PER_RUN']} — faqat birinchi "
              f"{config['GEMINI_MAX_REQUESTS_PER_RUN']} tasi tahlil qilinadi.")
        manifest = manifest[: config["GEMINI_MAX_REQUESTS_PER_RUN"]]

    last_call_ts = 0.0
    for entry in manifest:
        slug = entry["slug"]
        screenshot_path = os.path.join(output_dir, entry["screenshot"])
        output_path = os.path.join(output_dir, slug, "gemini_response.md")

        elapsed = time.time() - last_call_ts
        if elapsed < min_interval_s:
            wait_s = min_interval_s - elapsed
            print(f"⏳ RPM limitiga rioya qilish uchun {wait_s:.1f}s kutilmoqda...")
            time.sleep(wait_s)

        print(f"\n🤖 Tahlil qilinmoqda: {entry['url']} ({slug})")
        last_call_ts = time.time()
        ok, err = analyze_one(
            client, prompt_text, screenshot_path, output_path,
            retries=config["GEMINI_RETRY_COUNT"],
            retry_delay_s=config["GEMINI_RETRY_DELAY_SECONDS"],
        )
        if ok:
            print(f"✅ Saqlandi: {output_path}")
            entry["gemini_response"] = os.path.join(slug, "gemini_response.md")
        else:
            print(f"❌ Xatolik ({slug}): {err}")
            entry["gemini_response"] = None
            entry["error"] = err

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"\n🎉 Barcha sahifalar qayta ishlandi. Yangilangan manifest: {manifest_path}")


if __name__ == "__main__":
    main()
