export const songDetailStyles = `
.song-detail-page {
  gap: 22px;
}

.song-detail-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 320px;
  gap: 18px;
}

.song-detail-surface,
.song-detail-panel,
.song-detail-action {
  position: relative;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(18px);
}

.song-detail-surface {
  overflow: hidden;
  padding: 24px;
  background:
    radial-gradient(circle at 12% 18%, rgba(234, 76, 137, 0.12), transparent 18%),
    radial-gradient(circle at 88% 14%, rgba(234, 76, 137, 0.1), transparent 16%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 247, 250, 0.98)),
    #ffffff;
}

.song-detail-surface::after {
  content: '';
  position: absolute;
  inset: auto -60px -120px auto;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(234, 76, 137, 0.12), transparent 70%);
  pointer-events: none;
}

.song-detail-main {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.song-detail-cover {
  position: relative;
  width: 220px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background:
    radial-gradient(circle at 22% 20%, rgba(255, 255, 255, 0.24), transparent 22%),
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.18), transparent 18%),
    linear-gradient(180deg, #f3b4cc, #ea4c89);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.36),
    0 18px 34px rgba(234, 76, 137, 0.12);
}

.song-detail-ai-badge {
  position: absolute;
  z-index: 2;
  top: 12px;
  right: 12px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 4px;
  padding: 5px 8px;
  color: #ffffff;
  background: rgba(13, 12, 34, 0.7);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  backdrop-filter: blur(8px);
}

.song-detail-inline-ai {
  display: inline-block;
  vertical-align: middle;
  margin-left: 6px;
  border: 1px solid rgba(234, 76, 137, 0.18);
  border-radius: 4px;
  padding: 3px 6px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.07);
  font-size: 10px;
  font-weight: 800;
}

.song-detail-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-detail-cover__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 72px;
  font-weight: 800;
  letter-spacing: 0;
}

.song-detail-copy {
  display: grid;
  gap: 14px;
}

.song-detail-eyebrow,
.song-detail-block span,
.song-detail-side span,
.song-detail-meta strong {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.song-detail-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.song-detail-eyebrow b {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--theme);
  box-shadow: 0 0 0 7px rgba(234, 76, 137, 0.1);
}

.song-detail-copy h1,
.song-detail-block h2 {
  margin: 0;
  letter-spacing: 0;
}

.song-detail-copy h1 {
  font-size: clamp(34px, 4vw, 56px);
  line-height: 0.95;
}

.song-detail-summary {
  margin: 0;
  max-width: 760px;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.7;
}

.song-detail-tags,
.song-detail-stats,
.song-detail-meta,
.song-detail-action-row,
.song-detail-side__actions,
.song-detail-side__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.song-detail-tags span,
.song-detail-meta strong,
.song-detail-stats span,
.song-detail-side__stats span {
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
}

.song-detail-tags span,
.song-detail-side__stats span {
  border: 1px solid rgba(234, 76, 137, 0.14);
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.07);
}

.song-detail-stats span,
.song-detail-meta strong {
  color: var(--muted);
  background: #f7f7f9;
}

.song-detail-meta {
  gap: 14px;
}

.song-detail-meta div {
  display: grid;
  gap: 6px;
}

.song-detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 720px;
}

.song-detail-meta-card {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid rgba(13, 12, 34, 0.05);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
}

.song-detail-meta-card span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.song-detail-meta-card strong {
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
}

.song-detail-side {
  display: grid;
  gap: 18px;
  align-content: start;
  min-height: 100%;
  padding: 24px;
}

.song-detail-side__top {
  display: grid;
  gap: 10px;
}

.song-detail-side h2 {
  margin: 2px 0 0;
  font-size: 28px;
  line-height: 1;
}

.song-detail-side p,
.song-detail-block p,
.song-detail-lyrics {
  margin: 0;
  color: var(--muted);
  line-height: 1.72;
}

.song-detail-side__score {
  display: grid;
  gap: 6px;
  padding: 16px 0;
  border-top: 1px solid rgba(13, 12, 34, 0.08);
  border-bottom: 1px solid rgba(13, 12, 34, 0.08);
}

.song-detail-side__score strong {
  font-size: 34px;
  line-height: 1;
  color: var(--theme-dark);
}

.song-detail-side__actions {
  gap: 12px;
}

.song-detail-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  border-radius: 999px;
  padding: 0 18px;
  color: var(--text);
  background: #ffffff;
  box-shadow: none;
}

.song-detail-action:hover {
  transform: translateY(-1px);
  border-color: rgba(13, 12, 34, 0.12);
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.song-detail-action.is-primary {
  border-color: var(--theme);
  color: #ffffff;
  background: var(--theme);
}

.song-detail-action.is-primary:hover {
  border-color: var(--theme-dark);
  background: var(--theme-dark);
}

.song-detail-action.is-soft {
  border-color: rgba(234, 76, 137, 0.14);
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
}

.song-detail-action.is-liked {
  border-color: rgba(234, 76, 137, 0.22);
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.12);
}

.song-detail-action.is-danger {
  border-color: rgba(214, 51, 108, 0.18);
  color: #d6336c;
  background: rgba(214, 51, 108, 0.06);
}

.song-detail-action.is-danger:hover {
  border-color: #d6336c;
  color: #ffffff;
  background: #d6336c;
}

.song-detail-delete-note {
  width: 100%;
  margin: 0;
  border: 1px solid rgba(13, 12, 34, 0.06);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--muted);
  background: rgba(13, 12, 34, 0.03);
  font-size: 13px;
  line-height: 1.55;
}

.song-detail-toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 12px;
}

.song-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 360px;
  gap: 18px;
  align-items: start;
}

.song-detail-block,
.song-detail-panel {
  display: grid;
  gap: 14px;
  padding: 24px;
}

.song-detail-block.is-lyrics {
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    inset 0 -18px 30px rgba(13, 12, 34, 0.04);
}

.song-detail-block__header,
.song-detail-panel__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.song-detail-panel__header > div {
  display: grid;
  gap: 8px;
}

.song-detail-panel__button {
  position: absolute;
  top: 24px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  margin-top: 0;
  border: 1px solid rgba(234, 76, 137, 0.16);
  border-radius: 999px;
  padding: 0 16px;
  color: var(--theme);
  font-size: 13px;
  font-weight: 800;
  background: #fff;
  box-shadow: 0 12px 28px rgba(234, 76, 137, 0.16);
  cursor: pointer;
}

.song-detail-panel__button:disabled {
  cursor: not-allowed;
  opacity: 0.64;
}

.song-detail-block h2 {
  font-size: 24px;
}

.song-detail-lyrics {
  max-height: 380px;
  overflow: auto;
  padding: 6px 12px 6px 0;
  min-height: 240px;
  white-space: pre-wrap;
  font-size: 15px;
  mask-image: linear-gradient(to bottom, transparent 0, #000 28px, #000 calc(100% - 34px), transparent 100%);
}

.song-detail-lyrics::-webkit-scrollbar {
  width: 8px;
}

.song-detail-lyrics::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(13, 12, 34, 0.05);
}

.song-detail-lyrics::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.26);
}

.song-detail-lyrics::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 76, 137, 0.42);
}

.song-detail-block.is-lyrics::before,
.song-detail-block.is-lyrics::after {
  content: '';
  position: absolute;
  left: 24px;
  right: 24px;
  z-index: 1;
  height: 34px;
  pointer-events: none;
}

.song-detail-block.is-lyrics::before {
  top: 70px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0));
}

.song-detail-block.is-lyrics::after {
  bottom: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 247, 250, 0.98));
}

.song-detail-stack {
  display: grid;
  gap: 18px;
}

.song-detail-overview {
  display: grid;
  gap: 10px;
}

.song-detail-overview__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(13, 12, 34, 0.06);
}

.song-detail-overview__row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.song-detail-overview__row strong {
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
}

.song-remix-tree {
  align-content: start;
}

.song-remix-tree__count {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
  font-size: 12px;
  font-weight: 900;
}

.song-remix-tree__body {
  overflow-x: auto;
  padding: 2px 0 4px;
}

.song-remix-tree__node {
  display: grid;
  gap: 10px;
}

.song-remix-tree__children {
  display: grid;
  gap: 10px;
  margin-left: 26px;
  padding-left: 18px;
  border-left: 1px solid rgba(234, 76, 137, 0.18);
}

.song-remix-tree__item {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 64px;
  border: 1px solid rgba(13, 12, 34, 0.07);
  border-radius: 8px;
  padding: 8px 12px 8px 8px;
  color: var(--ink);
  background: #ffffff;
  text-align: left;
  box-shadow: none;
}

.song-remix-tree__item:hover,
.song-remix-tree__item.is-current {
  border-color: rgba(234, 76, 137, 0.2);
  background: rgba(234, 76, 137, 0.05);
  transform: none;
}

.song-remix-tree__cover {
  position: relative;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  overflow: hidden;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--theme), #7dd3fc);
  font-size: 13px;
  font-weight: 900;
}

.song-remix-tree__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-remix-tree__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.song-remix-tree__copy strong,
.song-remix-tree__copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-remix-tree__copy strong {
  font-size: 15px;
}

.song-remix-tree__copy small {
  color: var(--muted);
  font-size: 12px;
}

.song-remix-tree__item b {
  border-radius: 999px;
  padding: 5px 8px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.1);
  font-size: 12px;
}

.song-detail-hole__count {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.08);
  font-size: 12px;
  font-weight: 900;
}

.song-detail-hole-form {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(234, 76, 137, 0.14);
  border-radius: 8px;
  background: rgba(234, 76, 137, 0.04);
}

.song-detail-hole-form textarea {
  min-height: 104px;
  border-color: rgba(13, 12, 34, 0.08);
  background: #ffffff;
  font-size: 14px;
  line-height: 1.6;
}

.song-detail-hole-form textarea:focus {
  outline: 3px solid rgba(234, 76, 137, 0.12);
  border-color: rgba(234, 76, 137, 0.28);
}

.song-detail-hole-form__footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 10px;
}

.song-detail-hole-form__footer label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.song-detail-hole-form__footer input {
  width: 16px;
  height: 16px;
  accent-color: var(--theme);
}

.song-detail-hole-form__footer > span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.song-detail-hole-form__footer .song-detail-action {
  min-height: 38px;
  padding: 0 14px;
  font-size: 13px;
}

.song-detail-comments {
  display: grid;
  gap: 12px;
}

.song-detail-comment {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  background: #ffffff;
}

.song-detail-comment.is-host {
  border-color: rgba(234, 76, 137, 0.18);
  background: rgba(234, 76, 137, 0.06);
}

.song-detail-comment__avatar {
  display: grid;
  place-items: center;
  width: 38px;
  aspect-ratio: 1;
  border-radius: 999px;
  color: #ffffff;
  background: #17172c;
  font-size: 14px;
  font-weight: 900;
}

.song-detail-comment.is-host .song-detail-comment__avatar {
  background: var(--theme);
  box-shadow: 0 10px 22px rgba(234, 76, 137, 0.18);
}

.song-detail-comment__body {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.song-detail-comment__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.song-detail-comment__meta strong {
  color: var(--ink);
  font-size: 14px;
}

.song-detail-comment__meta span {
  border-radius: 999px;
  padding: 4px 8px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.1);
  font-size: 11px;
  font-weight: 900;
}

.song-detail-comment__body p {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.7;
}

.song-detail-comment__body small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.song-detail-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 24px;
  background: rgba(13, 12, 34, 0.42);
  backdrop-filter: blur(14px);
}

.song-detail-modal {
  display: grid;
  gap: 16px;
  width: min(920px, 100%);
  max-height: min(76vh, 720px);
  overflow: auto;
  border: 1px solid rgba(234, 76, 137, 0.16);
  border-radius: 18px 18px 8px 8px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18);
}

.song-detail-modal__heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}

.song-detail-modal__heading span,
.song-detail-modal__field span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.song-detail-modal__heading h3 {
  margin: 4px 0 0;
  font-size: 26px;
}

.song-detail-modal__close {
  min-height: 38px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 999px;
  padding: 0 14px;
  color: var(--text);
  background: #ffffff;
  box-shadow: none;
}

.song-detail-add-target {
  display: grid;
  gap: 6px;
  border: 1px dashed rgba(234, 76, 137, 0.24);
  border-radius: 8px;
  padding: 16px;
  background: rgba(234, 76, 137, 0.05);
}

.song-detail-add-target strong {
  font-size: 18px;
}

.song-detail-add-target span {
  color: var(--muted);
  font-weight: 700;
}

.song-detail-playlist-list {
  display: grid;
  gap: 10px;
  max-height: 270px;
  overflow: auto;
  padding-right: 4px;
}

.song-detail-playlist-list::-webkit-scrollbar,
.song-detail-modal::-webkit-scrollbar {
  width: 8px;
}

.song-detail-playlist-list::-webkit-scrollbar-track,
.song-detail-modal::-webkit-scrollbar-track {
  border-radius: 999px;
  background: rgba(13, 12, 34, 0.05);
}

.song-detail-playlist-list::-webkit-scrollbar-thumb,
.song-detail-modal::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(234, 76, 137, 0.24);
}

.song-detail-playlist-item {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 74px;
  border: 1px solid rgba(13, 12, 34, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  text-align: left;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: none;
}

.song-detail-playlist-item:hover,
.song-detail-playlist-item.is-selected {
  border-color: rgba(234, 76, 137, 0.28);
  background: rgba(234, 76, 137, 0.06);
}

.song-detail-playlist-cover {
  display: grid;
  place-items: center;
  width: 54px;
  aspect-ratio: 1;
  border-radius: 8px;
  color: #ffffff;
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #f7a8c8, #ea4c89);
}

.song-detail-playlist-copy {
  display: grid;
  gap: 4px;
}

.song-detail-playlist-copy strong {
  color: var(--ink);
  font-size: 16px;
}

.song-detail-playlist-copy small {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.song-detail-playlist-check {
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.09);
  font-size: 12px;
  font-weight: 900;
}

.song-detail-create-playlist {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.song-detail-create-playlist input {
  min-height: 46px;
  border: 1px solid rgba(13, 12, 34, 0.1);
  border-radius: 999px;
  padding: 0 16px;
  color: var(--text);
  background: #f8f8fa;
  font: inherit;
  font-weight: 760;
}

.song-detail-create-playlist input:focus {
  outline: 3px solid rgba(234, 76, 137, 0.14);
  border-color: rgba(234, 76, 137, 0.34);
  background: #ffffff;
}

.song-detail-modal__hint {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.song-detail-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1100px) {
  .song-detail-hero,
  .song-detail-grid {
    grid-template-columns: 1fr;
  }

  .song-detail-side {
    min-height: auto;
  }
}

@media (max-width: 760px) {
  .song-detail-main {
    grid-template-columns: 1fr;
  }

  .song-detail-cover {
    width: min(100%, 220px);
  }

  .song-detail-meta-grid {
    grid-template-columns: 1fr;
  }

  .song-detail-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .song-detail-page {
    gap: 16px;
  }

  .song-detail-surface,
  .song-detail-panel,
  .song-detail-block {
    padding: 18px;
  }

  .song-detail-panel__button {
    top: 18px;
    right: 18px;
  }

  .song-detail-copy h1,
  .song-detail-side h2 {
    font-size: 28px;
  }

  .song-detail-summary,
  .song-detail-side p,
  .song-detail-block p,
  .song-detail-lyrics {
    font-size: 14px;
  }

  .song-detail-lyrics {
    max-height: 320px;
    min-height: 200px;
  }

  .song-detail-toolbar {
    grid-template-columns: 1fr;
  }

  .song-detail-action {
    width: 100%;
  }

  .song-detail-hole-form__footer {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .song-detail-hole-form__footer .song-detail-action {
    width: 100%;
  }

  .song-detail-modal-backdrop {
    padding: 12px;
  }

  .song-detail-modal {
    width: 100%;
    max-height: 82vh;
    border-radius: 16px 16px 8px 8px;
    padding: 18px;
  }

  .song-detail-playlist-item {
    grid-template-columns: 46px minmax(0, 1fr);
  }

  .song-detail-playlist-cover {
    width: 46px;
  }

  .song-detail-playlist-check {
    grid-column: 2;
    width: fit-content;
  }

  .song-detail-create-playlist,
  .song-detail-modal__actions {
    grid-template-columns: 1fr;
    display: grid;
  }

  .song-detail-block__header,
  .song-detail-panel__header,
  .song-detail-overview__row {
    display: grid;
    justify-content: start;
  }

  .song-detail-block.is-lyrics::before,
  .song-detail-block.is-lyrics::after {
    left: 18px;
    right: 18px;
  }
}

@media (max-width: 640px) {
  .song-detail-page {
    gap: 12px;
  }

  .song-detail-surface,
  .song-detail-panel,
  .song-detail-block {
    border-radius: 14px;
    padding: 14px;
  }

  .song-detail-copy h1,
  .song-detail-side h2 {
    font-size: 24px;
    line-height: 1.1;
  }

  .song-detail-summary,
  .song-detail-side p,
  .song-detail-block p,
  .song-detail-lyrics {
    font-size: 13px;
  }

  .song-detail-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .song-detail-action {
    min-height: 40px;
    padding: 0 9px;
    font-size: 12px;
  }

  .song-detail-lyrics {
    min-height: 150px;
    max-height: 240px;
  }

  .song-detail-hero {
    gap: 8px;
  }

  .song-detail-surface {
    overflow: visible;
    border: 0;
    border-radius: 0;
    padding: 4px 2px 12px;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .song-detail-surface::after {
    display: none;
  }

  .song-detail-main {
    grid-template-columns: 124px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
  }

  .song-detail-cover {
    width: 124px;
    border-radius: 12px;
    box-shadow: 0 16px 34px rgba(30, 22, 40, .13);
  }

  .song-detail-copy {
    gap: 7px;
  }

  .song-detail-copy h1 {
    font-size: 23px;
  }

  .song-detail-summary {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 11px;
    line-height: 1.4;
  }

  .song-detail-tags,
  .song-detail-stats {
    gap: 4px;
  }

  .song-detail-tags span,
  .song-detail-stats span {
    padding: 3px 6px;
    font-size: 9px;
  }

  .song-detail-meta-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px;
  }

  .song-detail-meta-card {
    min-height: 42px;
    border: 0;
    padding: 5px;
    background: rgba(13, 12, 34, .035);
  }

  .song-detail-meta-card span {
    font-size: 8px;
  }

  .song-detail-meta-card strong {
    overflow: hidden;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .song-detail-side {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    min-height: 0;
    border: 0;
    border-top: 1px solid rgba(13, 12, 34, .07);
    border-bottom: 1px solid rgba(13, 12, 34, .07);
    border-radius: 0;
    padding: 10px 2px;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .song-detail-side__top {
    gap: 3px;
  }

  .song-detail-side h2 {
    font-size: 17px;
  }

  .song-detail-side p {
    display: none;
  }

  .song-detail-side__score {
    padding: 0;
  }

  .song-detail-side__score strong {
    font-size: 20px;
  }

  .song-detail-side__actions {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .song-detail-side__actions button {
    min-height: 32px;
    padding: 0 9px;
    font-size: 10px;
  }

  .song-detail-toolbar {
    position: static;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .song-detail-action {
    min-height: 38px;
    padding: 0 7px;
    font-size: 10px;
  }

  .song-detail-block,
  .song-detail-panel {
    position: relative;
    border: 0;
    border-top: 1px solid rgba(13, 12, 34, .13);
    border-radius: 0;
    padding: 14px 2px;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .song-detail-block h2,
  .song-detail-panel h2 {
    font-size: 18px;
  }

  .song-detail-block__header,
  .song-detail-panel__header {
    position: relative;
    padding-left: 10px;
  }

  .song-detail-block__header::before,
  .song-detail-panel__header::before {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 0;
    width: 2px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(234, 76, 137, .75), rgba(116, 151, 218, .58));
    content: '';
  }

  .song-detail-overview {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    border-top: 1px solid rgba(13, 12, 34, .07);
    border-bottom: 1px solid rgba(13, 12, 34, .07);
  }

  .song-detail-overview__row {
    display: grid;
    align-content: center;
    gap: 5px;
    min-width: 0;
    min-height: 68px;
    border: 0;
    padding: 8px;
  }

  .song-detail-overview__row + .song-detail-overview__row {
    border-left: 1px solid rgba(13, 12, 34, .08);
  }

  .song-detail-overview__row span {
    font-size: 9px;
    white-space: nowrap;
  }

  .song-detail-overview__row strong {
    overflow: hidden;
    font-size: 12px;
    line-height: 1.35;
    text-overflow: ellipsis;
  }
}
`
