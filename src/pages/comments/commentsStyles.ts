export const commentsStyles = `
.comments-page {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 32px 0 140px;
}

.comments-page__heading {
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(13, 12, 34, 0.08);
}

.comments-page__heading > span {
  color: var(--theme);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.comments-page__heading h1 {
  margin: 8px 0;
  font-size: clamp(36px, 5vw, 58px);
}

.comments-page__heading p,
.comments-page__state {
  color: var(--muted);
}

.comments-page__list {
  display: grid;
  gap: 12px;
  padding-top: 22px;
}

.comments-page .song-detail-comment {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(13, 12, 34, 0.08);
  border-radius: 8px;
  background: #ffffff;
}

.comments-page .song-detail-comment.is-host {
  border-color: rgba(234, 76, 137, 0.22);
  background: rgba(234, 76, 137, 0.055);
}

.comments-page .song-detail-comment__avatar {
  display: grid;
  place-items: center;
  width: 42px;
  aspect-ratio: 1;
  border-radius: 50%;
  color: #fff;
  background: #17172c;
  font-weight: 900;
}

.comments-page .song-detail-comment.is-host .song-detail-comment__avatar {
  background: var(--theme);
}

.comments-page .song-detail-comment__body {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.comments-page .song-detail-comment__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.comments-page .song-detail-comment__meta span {
  border-radius: 999px;
  padding: 4px 8px;
  color: var(--theme-dark);
  background: rgba(234, 76, 137, 0.1);
  font-size: 11px;
  font-weight: 900;
}

.comments-page .song-detail-comment__meta span.is-ai {
  color: #fff;
  background: var(--theme);
}

.comments-page .song-detail-comment__body p {
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  line-height: 1.75;
}

.comments-page .song-detail-comment__body small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .comments-page {
    padding-top: 18px;
  }

  .comments-page .song-detail-comment {
    grid-template-columns: 36px minmax(0, 1fr);
    padding: 14px;
  }

  .comments-page .song-detail-comment__avatar {
    width: 36px;
  }
}
`
