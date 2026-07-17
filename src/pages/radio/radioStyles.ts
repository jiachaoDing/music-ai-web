export const radioStyles = `
.radio-page {
  --radio-ink: #17152b;
  --radio-pink: #ea4c89;
  --radio-violet: #8b5cf6;
  gap: clamp(18px, 2.4vw, 30px);
}

.radio-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  align-items: center;
  gap: clamp(20px, 4vw, 54px);
  min-height: 430px;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 22px 54px 22px 54px;
  padding: clamp(28px, 5vw, 64px);
  background:
    radial-gradient(circle at 82% 22%, rgba(139, 92, 246, 0.17), transparent 28%),
    radial-gradient(circle at 12% 90%, rgba(234, 76, 137, 0.13), transparent 30%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(251, 245, 255, 0.9));
  box-shadow: 0 22px 54px rgba(31, 24, 55, 0.08);
}

.radio-hero::after {
  content: '';
  position: absolute;
  inset: auto 4% 9% auto;
  width: 44%;
  border-top: 1px dashed rgba(139, 92, 246, 0.16);
  transform: rotate(-8deg);
}

.radio-hero__copy { position: relative; z-index: 2; display: grid; justify-items: start; }
.radio-live-line { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 28px; }
.radio-live { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; padding: 6px 10px; color: #c0265e; background: rgba(234, 76, 137, 0.09); font: 800 11px/1 ui-monospace, monospace; letter-spacing: .1em; }
.radio-live i { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--radio-pink); box-shadow: 0 0 0 0 rgba(234, 76, 137, .28); animation: radio-live-pulse 2.4s ease-out infinite; }
.radio-time { color: var(--muted); font: 700 11px/1.2 ui-monospace, monospace; letter-spacing: .08em; }
.radio-greeting { margin: 0 0 8px; color: var(--radio-pink); font-size: 15px; font-weight: 760; }
.radio-hero h1 { max-width: none; margin: 0; color: var(--radio-ink); font: 850 clamp(36px, 4.2vw, 64px)/1 Georgia, 'Times New Roman', serif; letter-spacing: -.035em; white-space: nowrap; }
.radio-intro { max-width: 610px; margin: 20px 0 28px; color: var(--muted); font-size: clamp(14px, 1.35vw, 17px); line-height: 1.75; }
.radio-now-meta { display: grid; grid-template-columns: auto auto; align-items: baseline; gap: 4px 12px; padding-left: 14px; border-left: 3px solid var(--active-radio-color); }
.radio-now-meta span { grid-column: 1 / -1; color: var(--muted); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.radio-now-meta strong { color: var(--radio-ink); font-size: 20px; }
.radio-now-meta small { color: var(--muted); }

.radio-console { position: relative; z-index: 2; display: grid; gap: 14px; width: min(420px,100%); border: 1px solid rgba(23,21,43,.12); border-radius: 24px 24px 34px 18px; padding: 18px; background: linear-gradient(145deg,#f8f7f4,#e9e7e4); box-shadow: inset 0 1px #fff, inset 0 -2px rgba(23,21,43,.05), 0 25px 48px rgba(23,21,43,.14); transform: rotate(1.2deg); }
.radio-console::before,.radio-console::after { content: ''; position: absolute; bottom: -8px; width: 38px; height: 10px; border-radius: 0 0 8px 8px; background: #cbc8c4; }.radio-console::before { left: 28px; }.radio-console::after { right: 28px; }
.radio-console__topline { display: flex; align-items: center; justify-content: space-between; color: #68656a; font: 800 9px/1 ui-monospace,monospace; letter-spacing: .13em; }
.radio-console__lights { display: flex; gap: 5px; }.radio-console__lights i { width: 5px; height: 5px; border-radius: 50%; background: #a8a5a1; }.radio-console__lights i:first-child { background: var(--radio-pink); box-shadow: 0 0 7px rgba(234,76,137,.6); }
.radio-display { position: relative; overflow: hidden; display: grid; gap: 4px; min-height: 142px; border: 5px solid #d6d3cf; border-radius: 12px; padding: 14px 16px; color: #63364e; background: radial-gradient(circle at 30% 20%,rgba(255,255,255,.35),transparent 35%),#f5dbe7; box-shadow: inset 0 0 22px rgba(92,45,68,.15),0 1px #fff; font-family: ui-monospace,'Cascadia Mono',monospace; }
.radio-display::after { content: ''; position: absolute; inset: 0; opacity: .13; background: repeating-linear-gradient(0deg,transparent 0 3px,#63364e 4px); pointer-events: none; }
.radio-display__status { display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 800; letter-spacing: .1em; }.radio-display__status i { width: 6px; height: 6px; border-radius: 50%; background: var(--active-radio-color); animation: radio-live-pulse 2.4s ease-out infinite; }
.radio-display__frequency { display: flex; align-items: end; gap: 7px; line-height: .9; }.radio-display__frequency strong { font-size: clamp(42px,5vw,62px); letter-spacing: -.07em; }.radio-display__frequency span { padding-bottom: 5px; font-size: 11px; font-weight: 800; }
.radio-display__station { font-size: 10px; font-weight: 800; letter-spacing: .07em; }
.radio-equalizer { position: absolute; right: 14px; bottom: 14px; display: flex; align-items: end; gap: 2px; height: 31px; }.radio-equalizer i { width: 3px; height: 9px; background: #8c496a; opacity: .75; animation: radio-wave 1.4s ease-in-out infinite alternate; }.radio-equalizer i:nth-child(3n) { height: 27px; animation-delay: -.6s; }.radio-equalizer i:nth-child(3n + 1) { height: 16px; animation-delay: -.2s; }
.radio-console__hardware { display: grid; grid-template-columns: 1fr 88px; gap: 18px; min-height: 105px; }
.radio-speaker { position: relative; overflow: hidden; border-radius: 12px; background-color: #d5d2ce; background-image: radial-gradient(circle,#777477 1.4px,transparent 1.7px); background-size: 8px 8px; box-shadow: inset 0 2px 8px rgba(23,21,43,.12); }.radio-speaker span { position: absolute; inset: 18% 28%; border-radius: 50%; background: radial-gradient(circle,#555 0 7%,#aaa 8% 12%,#686568 13% 60%,#4e4b4f 61%); opacity: .35; }
.radio-controls { display: grid; place-items: center; align-content: space-between; color: #777478; font: 800 8px/1 ui-monospace,monospace; letter-spacing: .1em; }
.radio-knob { position: relative; display: grid; place-items: start center; width: 67px; height: 67px; min-height: 0; border: 1px solid #bbb8b4; border-radius: 50%; padding: 7px 0 0; background: repeating-conic-gradient(#aaa 0 2deg,#e7e4e0 3deg 7deg); box-shadow: inset 0 0 0 9px #ddd9d5,0 5px 9px rgba(23,21,43,.13); }.radio-knob:hover { transform: none; box-shadow: inset 0 0 0 9px #ddd9d5,0 7px 13px rgba(23,21,43,.18); }.radio-knob:active { transform: translateY(2px); }.radio-knob i { width: 3px; height: 13px; border-radius: 9px; background: var(--active-radio-color); transform-origin: 50% 27px; transition: transform .38s cubic-bezier(.22,1,.36,1); }
.radio-toggle-row { display: flex; gap: 5px; }.radio-toggle-row button { display: grid; place-items: center; min-width: 20px; min-height: 16px; border: 1px solid #aaa7a4; border-radius: 5px; padding: 0 4px; color: #686568; background: #d7d4d0; box-shadow: inset 0 1px #fff,0 2px 3px rgba(23,21,43,.12); font: 800 7px/1 ui-monospace,monospace; }.radio-toggle-row button:hover { transform: translateY(-1px); color: var(--active-radio-color); background: #e6e3df; box-shadow: inset 0 1px #fff,0 3px 5px rgba(23,21,43,.15); }.radio-toggle-row button:active { transform: translateY(1px); box-shadow: inset 0 2px 3px rgba(23,21,43,.14); }

.radio-themes { display: grid; gap: 22px; padding: clamp(6px, 1vw, 12px) clamp(2px, .5vw, 6px); }
.radio-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; }
.radio-section-heading span,.radio-create-copy > span { color: var(--radio-pink); font-size: 11px; font-weight: 850; letter-spacing: .09em; }
.radio-section-heading h2,.radio-create-copy h2 { margin: 5px 0 0; color: var(--radio-ink); font-size: clamp(25px, 3vw, 36px); line-height: 1.08; }
.radio-refresh { min-height: 38px; border: 0; border-radius: 999px; padding: 0 14px; color: var(--radio-ink); background: transparent; box-shadow: none; font-weight: 760; }
.radio-refresh:hover { color: var(--radio-pink); background: rgba(234,76,137,.07); box-shadow: none; }
.radio-refresh span { display: inline-block; margin-right: 5px; color: inherit; font-size: 17px; transition: transform .3s ease; }.radio-refresh:hover span { transform: rotate(120deg); }

.radio-tuner { display: grid; grid-template-columns: minmax(0,1fr) 86px; align-items: center; gap: 22px; border: 1px solid rgba(23,21,43,.1); border-radius: 14px 36px 14px 36px; padding: 20px 24px; background: linear-gradient(145deg,#f8f7f4,#eceae7); box-shadow: inset 0 1px #fff,0 14px 28px rgba(23,21,43,.06); }
.radio-tuner__screen { display: grid; gap: 8px; border: 4px solid #dad7d3; border-radius: 8px; padding: 12px 16px 10px; background: #fffafc; box-shadow: inset 0 2px 8px rgba(23,21,43,.07); }
.radio-tuner__numbers { display: flex; justify-content: space-between; color: #8a8589; font: 700 9px/1 ui-monospace,monospace; }.radio-tuner__rail { position: relative; height: 16px; border-block: 1px solid rgba(23,21,43,.18); background: repeating-linear-gradient(90deg,rgba(23,21,43,.35) 0 1px,transparent 1px 4%); }.radio-tuner__rail i { position: absolute; top: -7px; width: 2px; height: 28px; background: var(--active-radio-color); box-shadow: 0 0 7px color-mix(in srgb,var(--active-radio-color) 55%,transparent); transition: left .42s cubic-bezier(.22,1,.36,1),background .25s ease; }
.radio-tuner__caption { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; color: var(--muted); font: 700 9px/1.2 ui-monospace,monospace; letter-spacing: .06em; }.radio-tuner__caption span { color: var(--radio-pink); font-weight: 900; }.radio-tuner__caption strong { color: var(--radio-ink); }.radio-tuner__caption small { font-size: 8px; }
.radio-tuner__knob { display: grid; place-items: start center; width: 76px; height: 76px; min-height: 0; border: 1px solid #c2bfbc; border-radius: 50%; padding: 8px 0 0; background: repeating-conic-gradient(#aaa 0 2deg,#eee 3deg 8deg); box-shadow: inset 0 0 0 11px #dedbd7,0 7px 12px rgba(23,21,43,.12); }.radio-tuner__knob:hover { transform: none; box-shadow: inset 0 0 0 11px #dedbd7,0 9px 15px rgba(23,21,43,.17); }.radio-tuner__knob:active { transform: translateY(2px); }.radio-tuner__knob i { width: 3px; height: 15px; border-radius: 8px; background: var(--active-radio-color); transform-origin: 50% 30px; transition: transform .38s cubic-bezier(.22,1,.36,1); }
.radio-theme-cloud { display: grid; grid-template-columns: repeat(7,minmax(0,1fr)); gap: 9px; padding: 4px clamp(4px,1vw,12px); background: radial-gradient(ellipse at center,rgba(234,76,137,.04),transparent 68%); }
.radio-theme { position: relative; overflow: hidden; display: grid; grid-template-columns: 40px minmax(0,1fr); align-items: center; gap: 10px; width: 100%; min-width: 0; min-height: 58px; border: 1px solid color-mix(in srgb, var(--radio-accent) 22%, white); border-radius: 999px; padding: 8px 12px 8px 9px; color: var(--radio-ink); text-align: left; background: rgba(255,255,255,.88); box-shadow: 0 8px 20px rgba(23,21,43,.04); }
.radio-theme:nth-child(4n + 1) { transform: translateY(5px); }.radio-theme:nth-child(4n + 3) { transform: translateY(-4px); }
.radio-theme:hover,.radio-theme.is-current { transform: translateY(-2px); border-color: color-mix(in srgb, var(--radio-accent) 48%, white); background: color-mix(in srgb, var(--radio-accent) 7%, white); box-shadow: 0 13px 25px color-mix(in srgb, var(--radio-accent) 12%, transparent); }
.radio-theme__icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; color: color-mix(in srgb, var(--radio-accent) 80%, #17152b); background: color-mix(in srgb, var(--radio-accent) 14%, white); font: 800 15px/1 ui-monospace, monospace; }
.radio-theme__copy { display: grid; min-width: 0; gap: 2px; }.radio-theme__copy strong,.radio-theme__copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.radio-theme__copy strong { font-size: 14px; }.radio-theme__copy small { color: var(--muted); font-size: 11px; }
.radio-theme__progress { position: absolute; inset: auto 0 0; height: 2px; background: linear-gradient(90deg, var(--radio-accent) 0 68%, transparent 68%); animation: radio-progress 60s linear infinite; transform-origin: left; }

.radio-create-stage { position: relative; overflow: hidden; display: grid; grid-template-columns: 150px minmax(0,1fr) auto; align-items: center; gap: clamp(20px,3vw,34px); min-height: 210px; border: 1px solid rgba(139,92,246,.12); border-radius: 46px 18px 46px 18px; padding: clamp(24px,3.5vw,40px); background: radial-gradient(circle at 12% 40%, rgba(234,76,137,.14), transparent 22%), linear-gradient(120deg,#fffafd,#f8f5ff); box-shadow: 0 18px 44px rgba(31,24,55,.07); }
.radio-create-visual { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; width: 138px; border: 1px solid rgba(23,21,43,.1); border-radius: 14px; padding: 14px; background: #eceae7; box-shadow: inset 0 1px #fff; }.radio-create-visual small { grid-column: 1/-1; color: #777; font: 800 8px/1 ui-monospace,monospace; letter-spacing: .14em; }
.radio-rec-light { display: grid; place-items: center; width: 46px; height: 46px; border: 1px solid #c3bfbc; border-radius: 50%; background: #d8d4d0; box-shadow: inset 0 2px 5px rgba(23,21,43,.12); }.radio-rec-light i { width: 21px; height: 21px; border-radius: 50%; background: #e13d68; box-shadow: inset 0 2px rgba(255,255,255,.3),0 0 14px rgba(225,61,104,.28); animation: radio-live-pulse 2.4s ease-out infinite; }
.radio-meter { display: flex; align-items: end; gap: 3px; height: 39px; }.radio-meter span { width: 4px; height: 12px; border-radius: 2px 2px 0 0; background: #777; }.radio-meter span:nth-child(2),.radio-meter span:nth-child(4) { height: 25px; }.radio-meter span:nth-child(3) { height: 35px; background: var(--radio-pink); }
.radio-create-copy { display: grid; gap: 4px; }.radio-create-copy p { max-width: 600px; margin: 8px 0; color: var(--muted); line-height: 1.65; }
.radio-create-tags { display: flex; flex-wrap: wrap; gap: 7px; }.radio-create-tags i { border-radius: 999px; padding: 5px 9px; color: var(--muted); background: rgba(23,21,43,.045); font-size: 11px; font-style: normal; font-weight: 700; }
.radio-dj-stage { display: grid; gap: 16px; border: 1px solid rgba(234,76,137,.12); border-radius: 18px 42px 18px 42px; padding: clamp(22px,3vw,34px); background: linear-gradient(135deg,rgba(255,255,255,.95),rgba(255,247,251,.92)); box-shadow: 0 16px 36px rgba(31,24,55,.06); }
.radio-dj-controls { display: grid; grid-template-columns: minmax(180px,1fr) repeat(3,auto); align-items: center; gap: 10px; }.radio-dj-controls select { min-height: 44px; border: 1px solid rgba(23,21,43,.12); border-radius: 12px; padding: 0 12px; background: white; }.radio-dj-controls button { min-height: 44px; }
.radio-dj-result { display: grid; gap: 10px; border-left: 3px solid var(--radio-pink); padding: 12px 16px; background: rgba(234,76,137,.05); }.radio-dj-result p,.radio-dj-empty,.radio-dj-error { margin: 0; line-height: 1.65; }.radio-dj-result audio { width: min(520px,100%); }.radio-dj-error { color: #be123c; }
.radio-generate { display: grid; grid-template-columns: auto auto auto; align-items: center; gap: 14px; min-height: 72px; border: 0; border-radius: 999px; padding: 9px 18px 9px 12px; color: #fff; text-align: left; background: linear-gradient(120deg,var(--radio-pink),var(--radio-violet)); box-shadow: 0 16px 30px rgba(139,92,246,.22); }
.radio-generate > span:nth-child(2) { display: grid; gap: 3px; }.radio-generate strong { font-size: 14px; }.radio-generate small { color: rgba(255,255,255,.75); font-size: 10px; }.radio-generate b { font-size: 20px; }
.radio-generate__wave { display: flex; align-items: center; justify-content: center; gap: 3px; width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,.14); }.radio-generate__wave i { width: 3px; height: 13px; border-radius: 9px; background: #fff; }.radio-generate__wave i:nth-child(2),.radio-generate__wave i:nth-child(4) { height: 24px; }

@keyframes radio-live-pulse { 70% { box-shadow: 0 0 0 8px rgba(234,76,137,0); } 100% { box-shadow: 0 0 0 0 rgba(234,76,137,0); } }
@keyframes radio-wave { to { transform: scaleY(.45); opacity: .5; } }
@keyframes radio-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

@media (prefers-reduced-motion: reduce) { .radio-live i,.radio-display__status i,.radio-equalizer i,.radio-theme__progress,.radio-tuner__rail i,.radio-rec-light i { animation: none; } }
@media (max-width: 980px) { .radio-hero { grid-template-columns: 1fr; }.radio-console { justify-self: center; }.radio-theme-cloud { grid-template-columns: repeat(4,minmax(0,1fr)); }.radio-create-stage { grid-template-columns: 150px 1fr; }.radio-generate { grid-column: 1 / -1; justify-self: stretch; justify-content: center; }.radio-dj-controls { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .radio-page { gap: 18px; }.radio-hero { min-height: auto; border-radius: 20px; padding: 24px 18px; }.radio-hero h1 { font-size: clamp(32px,10vw,44px); white-space: normal; }.radio-live-line { margin-bottom: 20px; }.radio-now-meta { grid-template-columns: 1fr; }.radio-console { padding: 13px; transform: none; }.radio-display { min-height: 130px; }.radio-console__hardware { grid-template-columns: 1fr 76px; min-height: 90px; }.radio-knob { width: 58px; height: 58px; }.radio-section-heading { align-items: start; }.radio-section-heading h2 { font-size: 26px; }.radio-tuner { grid-template-columns: 1fr; padding: 14px; border-radius: 14px; }.radio-tuner__knob { display: none; }.radio-tuner__numbers span:nth-child(even) { display: none; }.radio-tuner__caption { grid-template-columns: auto 1fr; }.radio-tuner__caption small { display: none; }.radio-theme-cloud { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; padding: 6px 0; }.radio-theme,.radio-theme:nth-child(n) { grid-template-columns: 36px minmax(0,1fr); min-height: 50px; padding: 6px 10px 6px 7px; transform: none; }.radio-theme__icon { width: 36px; height: 36px; }.radio-dj-controls { grid-template-columns: 1fr; }.radio-create-stage { grid-template-columns: 1fr; border-radius: 22px; padding: 22px 18px; }.radio-create-visual { width: 138px; }.radio-generate { grid-column: auto; grid-template-columns: auto 1fr auto; padding-right: 14px; }.radio-generate__wave { width: 46px; height: 46px; } }
`
