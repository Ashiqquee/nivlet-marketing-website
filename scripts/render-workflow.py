#!/usr/bin/env python3
"""Frame the verified real Nivlet → Codex recording for the marketing player.

Original recorded desktop view and simple step labels. Removes
verification selections/idle time. Never invents clipboard or attachment states.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'artwork/workflow-demo'
OUT = ROOT / 'public/assets'
SOURCE = ART / 'codex-source-v1.mp4'
OPENING = ART / 'copy-source-v1.mp4'
FONT = ROOT / 'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'
SCENES = [
    # crop rectangles below refer to the actual 2940 × 1912 source, at 2x.
    dict(start=0, end=2.7, title='Pick a saved prompt.', kind='panel', chapter='Your prompts'),
    dict(start=2.7, end=5.21, title='Choose the one you need.', kind='panel'),
    dict(start=5.21, end=7.38, title='Click Copy prompt.', kind='panel', chapter='Copy & paste'),
    dict(start=7.38, end=9.6, title='Paste into your chat.', kind='paste'),
    dict(start=15.52, end=19.02, title='Pick another prompt.', kind='panel', chapter='Pick another'),
    dict(start=19.02, end=22.3, title='Copy and paste. That’s it.', kind='qa'),
    dict(start=28.23, end=33.28, title='Drag an image into your chat.', kind='wide', chapter='Add an image'),
    dict(start=33.28, end=38.8, title='Your text and image. Ready to send.', kind='attached'),
]


def run(args):
    subprocess.run([str(a) for a in args], check=True)


def stamp(value):
    milliseconds = round(value * 1000)
    return f'{milliseconds // 3600000:02}:{milliseconds // 60000 % 60:02}:{milliseconds // 1000 % 60:02}.{milliseconds % 1000:03}'


def main():
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
    capture = json.loads((ART / 'capture-v1.json').read_text())
    marks = {item['title']: item['time'] for item in capture['marks']}
    intervals = [(0, 2.7), (2.7, marks['Copy prompt']),
                 (marks['Copy prompt'], marks['Paste into Codex']),
                 (marks['Paste into Codex'], marks['Paste into Codex'] + 2.22),
                 (marks['Launch QA prompt'], marks['Paste launch QA into Codex']),
                 (marks['Paste launch QA into Codex'], marks['Paste launch QA into Codex'] + 3.28),
                 (marks['UI reference'], marks['Check attachment in Codex']),
                 (marks['Check attachment in Codex'], marks['Check attachment in Codex'] + 5.52)]
    for scene, (start, end) in zip(SCENES, intervals):
        scene.update(start=round(start, 3), end=round(end, 3), frames=round((end - start) * 30))
    for i, scene in enumerate(SCENES):
        scene['source'] = OPENING.name if i < 4 else SOURCE.name
    with tempfile.TemporaryDirectory(prefix='nivlet-codex-edit-') as temporary:
        tmp = Path(temporary)
        for weight in (600,):
            font = instantiateVariableFont(TTFont(FONT), {'wght': weight}, inplace=False)
            font.flavor = None
            font.save(tmp / f'geist-{weight}.ttf')
        chapters = []
        elapsed = 0
        for scene in SCENES:
            scene['output_start'] = round(elapsed, 3)
            if 'chapter' in scene:
                chapters.append(dict(title=scene['chapter'], time=round(elapsed, 3)))
            elapsed += scene['frames'] / 30
        for i, scene in enumerate(SCENES):
            title = tmp / f'title-{i}.txt'
            title.write_text(scene['title'])
            duration = scene['end'] - scene['start']
            # Keep the actual desktop in view throughout. No sidebar zooms,
            # separate portrait crop, fake pointer, or re-created app controls.
            filters = (
                '[0:v]crop=2940:1840:0:66,setpts=PTS-STARTPTS,scale=1440:900,fps=30[app];'
                f"[app]drawtext=fontfile='{tmp}/geist-600.ttf':textfile='{title}':"
                'fontcolor=0xf4eee9:fontsize=22:x=92:y=58:'
                'box=1:boxcolor=0x171719@0.92:boxborderw=13[out]'
            )
            run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', scene['start'], '-t', duration,
                 '-i', OPENING if i < 4 else SOURCE, '-filter_complex', filters, '-map', '[out]', '-frames:v', scene['frames'],
                 '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', tmp / f'{i}.mp4'])
        listing = tmp / 'concat.txt'
        listing.write_text(''.join(f"file '{tmp / str(i)}.mp4'\n" for i in range(len(SCENES))))
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listing,
             '-c', 'copy', '-movflags', '+faststart', OUT / 'workflow-demo-v1.mp4'])
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', OUT / 'workflow-demo-v1.mp4', '-ss', '0.8',
             '-frames:v', '1', '-q:v', '2', OUT / 'workflow-demo-v1.jpg'])
        descriptions = [
            'Open Nivlet beside the real Codex app. The Website launch pocket has two saved prompts.',
            'Choose a prompt from the list.',
            'Choose Copy prompt. The native app confirms the copy.',
            'Press Command-V to paste the saved text into Codex.',
            'Choose another saved prompt.',
            'Copy and paste the other prompt into your chat. Nothing is sent.',
            'Open References and drag an image into your chat.',
            'The image thumbnail appears in the Codex composer beside the prompt. Check the attachment before sending.',
        ]
        vtt = 'WEBVTT\n\n'
        for scene, description in zip(SCENES, descriptions):
            start = scene['output_start']
            end = start + scene['frames'] / 30
            vtt += f'{stamp(start)} --> {stamp(end)}\n{description}\n\n'
        (OUT / 'workflow-demo-v1.vtt').write_text(vtt.rstrip() + '\n')
        prompts = json.loads((ART / 'prompts.json').read_text())
        transcript = 'Nivlet → Codex: saved prompts and a UI reference\n\n' + '\n\n'.join(descriptions)
        transcript += '\n\nPrompts used in this demo\n\n' + '\n\n'.join(f"{p['title']}\n{p['text']}" for p in prompts)
        transcript += '\n\nRecording notes\nActual Nivlet Debug app using an isolated synthetic library, and the owner’s open Codex desktop app. Both pasted prompts were checked against the saved text. The image attachment was visually checked in the Codex composer. No prompt was submitted and no model response is shown. The edit combines two actual takes and removes idle time and verification selections, keeps both apps in view and adds simple step labels, and runs actions at their recorded speed. It is not a performance measurement or a promise about every destination app.\n'
        (OUT / 'workflow-demo-v1-transcript.txt').write_text(transcript)
        report = dict(source='artwork/workflow-demo/codex-source-v1.mp4', source_sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                      opening_source='artwork/workflow-demo/copy-source-v1.mp4', opening_sha256=hashlib.sha256(OPENING.read_bytes()).hexdigest(),
                      duration=round(elapsed, 3), desktop=[1440, 900], framing='Both apps remain visible throughout on every screen size', fps=30, audio=False,
                      chapters=chapters, edits=SCENES,
                      notes='Real Nivlet and Codex pixels. Full desktop view, simple step labels and removed verification/idle pauses. No fabricated copy, file attachment, sending or model response.')
        (OUT / 'workflow-demo-v1.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps(dict(duration=elapsed, chapters=chapters)))


if __name__ == '__main__':
    main()
