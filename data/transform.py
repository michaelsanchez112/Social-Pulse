#!/usr/bin/env python3
"""Transform raw Facebook scraper dataset into clean FacebookPost JSON."""

import json
from datetime import datetime, timezone

INPUT = "/Users/michaelsanchez/Downloads/dataset_facebook-posts-scraper_2026-02-14_16-44-36-662.json"
OUTPUT = "/Users/michaelsanchez/Downloads/Social-Pulse-main/data/facebook-posts.json"
FALLBACK_DATE = "2026-02-14T00:00:00Z"

def transform_post(raw, index):
    media = raw.get("media") or []
    has_media = len(media) > 0
    first_media = media[0] if has_media else None

    # Determine media type
    # Detect dummy 1px images used as a reach hack (120x1 photo_image = text post)
    uses_image_exploit = False
    if not has_media:
        media_type = "TEXT"
    elif first_media.get("__typename") == "Video":
        media_type = "VIDEO"
    else:
        pi = first_media.get("photo_image") or {}
        if pi.get("width") == 120 and pi.get("height") == 1:
            media_type = "TEXT"
            uses_image_exploit = True
        else:
            media_type = "IMAGE"
            uses_image_exploit = False

    # Build post
    post = {
        "id": str(index + 1),
        "author": {
            "name": "Casper Capital",
            "avatarUrl": "/data/casper-capital-avatar.jpg",
            "handle": "@socialpulse",
        },
        "content": raw.get("text") or "",
        "mediaType": media_type,
        "postUrl": raw.get("url", ""),
        "usesImageExploit": uses_image_exploit,
        "stats": {
            "likes": raw.get("likes", 0),
            "comments": raw["comments"] if isinstance(raw.get("comments"), int) else 0,
            "shares": raw.get("shares", 0),
            "views": 0,
        },
    }

    # Media-specific fields
    if media_type == "IMAGE":
        post["mediaUrl"] = first_media.get("thumbnail")
    elif media_type == "VIDEO":
        post["thumbnailUrl"] = first_media.get("thumbnail")

    # Date: use publish_time from media if available
    if first_media and first_media.get("publish_time"):
        ts = first_media["publish_time"]
        post["postedAt"] = datetime.fromtimestamp(ts, tz=timezone.utc).isoformat().replace("+00:00", "Z")
    else:
        post["postedAt"] = FALLBACK_DATE

    return post


def main():
    with open(INPUT, "r") as f:
        raw_data = json.load(f)

    posts = [transform_post(raw, i) for i, raw in enumerate(raw_data)]

    with open(OUTPUT, "w") as f:
        json.dump(posts, f, indent=2)

    print(f"Transformed {len(posts)} posts -> {OUTPUT}")

    import os
    input_size = os.path.getsize(INPUT)
    output_size = os.path.getsize(OUTPUT)
    print(f"Input size:  {input_size:>10,} bytes ({input_size / 1024:.1f} KB)")
    print(f"Output size: {output_size:>10,} bytes ({output_size / 1024:.1f} KB)")
    print(f"Reduction:   {(1 - output_size / input_size) * 100:.1f}%")


if __name__ == "__main__":
    main()
