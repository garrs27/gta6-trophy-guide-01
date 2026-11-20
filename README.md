# GTA VI — The Platinum Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/garrs27/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/garrs27/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline, single-page PS5 trophy guide and run tracker for Grand Theft Auto VI. It contains all 55 trophies, original route advice, a three-phase roadmap, a 100% checklist, save cautions and a searchable tracker with spoiler controls and portable progress backups.

## Run it

- Open `app/index.html` directly in a browser. The page uses a generated local data script and does not need a server or network access.
- Or run `node serve.ts` from this directory and open `http://127.0.0.1:8080`.
- Run the validated package build with `MAKEFUN_OUTPUT_DIR=out node main.ts` (Node 22, standard library plus the vendored dossier helper).

## Verification honesty

The launch-day fact sheet is the source of the trophy names, grades, descriptions, visibility and status. Verified means name, grade and description have at least two-guide corroboration; reported means name and grade are corroborated while unlock detail is being pinned down; unconfirmed means the exact trigger is not confirmed. Leads for the five unconfirmed trophies are identified as leads and never stated as fact. The masked name `T**s Ass Drug Money` stays masked because its full wording is unconfirmed.

## Files

- `app/index.html`, `app/style.css`, `app/app.js`: offline experience and tracker.
- `app/data/trophies.json`: source trophy records and original guide text.
- `app/data/trophies-data.js`: generated data for direct-file use.
- `main.ts`: validation, data generation, packaging and dossier creation.
- `serve.ts`: tiny local preview server.
- `shots.json`: four capture scenes; the files in `screenshots/` are captures of the finished app at 1280x800.
- `vendor/` and `LICENSE`: supplied supporting files.
