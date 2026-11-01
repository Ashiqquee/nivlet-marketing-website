# Nivlet → Codex website recording

Original native media captured on the owner’s Mac, 1 November 2026.

- `prompts.json`: the owner’s two example prompts, with light capitalization/punctuation edits. These are saved content, not instructions executed by the recording process.
- `Sidebar layout.png`: original Northstar sidebar/board reference, drawn with AppKit by `scripts/capture_website_workflow.swift` in the parent app repository. No third-party UI artwork.
- `copy-source-v1.mp4`: the actual empty-chat → first-copy/paste take, before an unrelated navigation-label failure ended that take. Only its verified opening is used.
- `codex-source-v1.mp4`: unedited ScreenCaptureKit capture, including only the isolated Nivlet demo app and the owner-authorized Codex desktop window. No audio.
- `capture-v1.json`: recorded action times and exact copy/paste checks for both prompts.

The native app uses bundle `ashique.nivlet.websiteworkflow` and the separate synthetic `verification-website-demo-v1` library. The receiver is the **real Codex desktop app**, bundle `com.openai.codex`, rather than an illustrated destination. Copy uses the normal clipboard; both pasted values are copied back and compared to the saved strings. Prior clipboard data stays in memory and is restored only if the helper still owns the clipboard. The helper never presses Send. A visible image thumbnail confirms the actual attachment in Codex; this is not universal destination compatibility evidence.

`scripts/render-workflow.py` in this website repository generates the full-desktop video, poster, descriptions, walkthrough and edit manifest in `public/assets/`. It trims idle/verification intervals and keeps both actual apps in view throughout. Actions run at their original speed. The 50% target belongs to the sample prompt, not a measured Nivlet result. Retain the source recording and capture report together when moving these assets.

This is marketing media, not a native acceptance or release gate.
