import { useEffect, useState } from 'react'
import { fetchCommunityPosts, updateCommentModeration, type CommunityPost } from '../services/communityService'

export function AdminCommunityCommentsPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])

  useEffect(() => {
    void fetchCommunityPosts().then(setPosts)
  }, [])

  return (
    <div className="admin-community-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">COMMENT MODERATION</span>
          <h1>Community Comments</h1>
          <p>Review, hide, restore, and remove comments.</p>
        </div>
      </div>

      <div className="admin-panels">
        {posts.flatMap((post) => post.comments).map((comment) => (
          <div className="admin-community-card" key={comment.id}>
            <div className="community-card-head">
              <div>
                <strong>{comment.farmer}</strong>
                <span>{comment.content}</span>
              </div>
              <span className={`status-pill status-${comment.status.toLowerCase()}`}>{comment.status}</span>
            </div>
            <div className="community-actions">
              <button type="button" onClick={() => void updateCommentModeration(comment.id, 'HIDDEN')}>Hide comment</button>
              <button type="button" onClick={() => void updateCommentModeration(comment.id, 'ACTIVE')}>Restore comment</button>
              <button type="button" onClick={() => void updateCommentModeration(comment.id, 'DELETED')}>Delete comment</button>
              <button type="button" onClick={() => void updateCommentModeration(comment.id, 'UNDER_REVIEW')}>Mark reviewed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
