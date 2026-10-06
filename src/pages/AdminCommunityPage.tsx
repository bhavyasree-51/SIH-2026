import { useEffect, useState } from 'react'
import { fetchAdminCommunitySummary, fetchCommunityPosts, updatePostModeration, type CommunityPost } from '../services/communityService'

export function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [summary, setSummary] = useState({ totalPosts: 0, postsToday: 0, comments: 0, reports: 0, pendingModeration: 0, hiddenPosts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [nextPosts, nextSummary] = await Promise.all([fetchCommunityPosts(), fetchAdminCommunitySummary()])
        setPosts(nextPosts)
        setSummary(nextSummary)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <div className="admin-community-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">COMMUNITY MODERATION</span>
          <h1>Admin Community</h1>
          <p>Review farmer discussions, reports, and moderation state.</p>
        </div>
        <span className="admin-demo">REAL DB MODERATION</span>
      </div>

      <div className="admin-stats">
        <div className="admin-stat"><span>Total Posts</span><strong>{summary.totalPosts}</strong><small>Live</small></div>
        <div className="admin-stat"><span>Posts Today</span><strong>{summary.postsToday}</strong><small>Today</small></div>
        <div className="admin-stat"><span>Comments</span><strong>{summary.comments}</strong><small>All time</small></div>
        <div className="admin-stat"><span>Reports</span><strong>{summary.reports}</strong><small>Open</small></div>
      </div>

      <div className="admin-panels">
        {loading ? (
          <div className="status-box">Loading community moderation…</div>
        ) : posts.map((post) => (
          <div className="admin-community-card" key={post.id}>
            <div className="community-card-head">
              <div>
                <strong>{post.farmer}</strong>
                <span>{post.crop} · {post.category}</span>
              </div>
              <span className={`status-pill status-${post.status.toLowerCase()}`}>{post.status}</span>
            </div>
            <p>{post.content}</p>
            <div className="community-card-meta">
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              <span>{post.commentCount} comments</span>
              <span>{post.helpfulCount} helpful</span>
            </div>
            <div className="community-actions">
              <button type="button" onClick={() => void updatePostModeration(post.id, 'ACTIVE')}>View</button>
              <button type="button" onClick={() => void updatePostModeration(post.id, 'HIDDEN')}>Hide</button>
              <button type="button" onClick={() => void updatePostModeration(post.id, 'ACTIVE')}>Restore</button>
              <button type="button" onClick={() => void updatePostModeration(post.id, 'DELETED')}>Delete</button>
              <button type="button" onClick={() => void updatePostModeration(post.id, 'UNDER_REVIEW')}>Mark Reviewed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
