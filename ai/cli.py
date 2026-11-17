"""Command-line tester.  Run from the repo root:
    python -m ai.cli analyze   photo.jpg
    python -m ai.cli similarity a.jpg b.jpg
    python -m ai.cli compare   before.jpg after.jpg
"""
import argparse
import json
import sys

from ai import analyze_image, compare_before_after, compute_similarity
from ai.errors import AIModuleError


def main() -> int:
    parser = argparse.ArgumentParser(description="BuildWatch AI module tester")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("analyze").add_argument("image")
    p_sim = sub.add_parser("similarity")
    p_sim.add_argument("image_a")
    p_sim.add_argument("image_b")
    p_cmp = sub.add_parser("compare")
    p_cmp.add_argument("before")
    p_cmp.add_argument("after")
    args = parser.parse_args()

    try:
        if args.command == "analyze":
            out = analyze_image(args.image)
        elif args.command == "similarity":
            out = {"image_similarity": compute_similarity(args.image_a, args.image_b)}
        else:
            out = compare_before_after(args.before, args.after)
    except AIModuleError as exc:
        print(f"AI error: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())