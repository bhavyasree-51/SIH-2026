import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Flag, Heart, MessageCircle, Search, Send, Sparkles, Users, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import {
  addCommentToPost,
  communityCategories,
  createCommunityPost,
  createCommunityReport,
  detectCommunitySignal,
  fetchCommunityPosts,
  toggleHelpfulPost,
  type CommunityPost,
} from '../services/communityService'

const categoryFilters = ['All', ...communityCategories]
const reportReasons = ['Spam', 'Wrong information', 'Abusive content', 'Scam', 'Irrelevant', 'Other']

type PostFormState = {
  content: string
  crop: string
  category: string
  locationDistrict: string
  imageFile: File | null
  imagePreview: string
}

export function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Latest')
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('Spam')
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [postForm, setPostForm] = useState<PostFormState>({
    content: '',
    crop: 'Tomato',
    category: 'Crop Problem',
    locationDistrict: '',
    imageFile: null,
    imagePreview: '',
  })

  const loadPosts = async () => {
    try {
      setLoading(true)
      setPosts(await fetchCommunityPosts())
      setError(null)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load community posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPosts()
  }, [])

  const signal = useMemo(() => detectCommunitySignal(posts), [posts])

  const filteredPosts = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const visible = posts.filter((post) => {
      if (post.status !== 'ACTIVE') return false
      if (showMyPostsOnly && post.farmerId !== user?.id) return false
      if (category !== 'All' && post.category !== category) return false
      if (!normalized) return true
      return `${post.content} ${post.crop} ${post.category} ${post.farmer} ${post.location}`.toLowerCase().includes(normalized)
    })

    return [...visible].sort((a, b) => {
      if (sort === 'Most Helpful') return b.helpfulCount - a.helpfulCount
      if (sort === 'Most Commented') return b.commentCount - a.commentCount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [posts, search, category, showMyPostsOnly, user, sort])

  const handleCreatePost = async () => {
    if (!postForm.content.trim()) {
      setError('Please write a post before publishing.')
      return
    }

    try {
      setSubmitting(true)
      const nextPost = await createCommunityPost({
        content: postForm.content,
        crop: postForm.crop,
        category: postForm.category,
        imageFile: postForm.imageFile,
        locationDistrict: postForm.locationDistrict,
      })

      setPosts((current) => [nextPost, ...current])
      setPostForm({
        content: '',
        crop: 'Tomato',
        category: 'Crop Problem',
        locationDistrict: '',
        imageFile: null,
        imagePreview: '',
      })
      setError(null)
      setFeedback('Your post was published to the community.')
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create the post.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpful = async (postId: string) => {
    try {
      const result = await toggleHelpfulPost(postId)

      if (result && typeof result !== 'boolean') {
        setPosts((current) => current.map((post) => post.id === postId ? { ...post, helpfulByCurrentUser: result.helpfulByCurrentUser, helpfulCount: result.helpfulCount } : post))
        return
      }

      setPosts((current) => current.map((post) => post.id === postId ? {
        ...post,
        helpfulByCurrentUser: !post.helpfulByCurrentUser,
        helpfulCount: Math.max(0, post.helpfulCount + (post.helpfulByCurrentUser ? -1 : 1)),
      } : post))
    } catch (helpfulError) {
      setError(helpfulError instanceof Error ? helpfulError.message : 'Unable to update Helpful.')
    }
  }

  const handleAddComment = async (postId: string, value: string) => {
    const content = value.trim()
    if (!content) return

    try {
      const newComment = await addCommentToPost(postId, content)
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, comments: [...post.comments, newComment], commentCount: post.commentCount + 1 } : post))
      setFeedback('Comment added successfully.')
    } catch (commentError) {
      setError(commentError instanceof Error ? commentError.message : 'Unable to save comment.')
    }
  }

  const handleReport = async (postId?: string, commentId?: string) => {
    try {
      await createCommunityReport({
        postId: postId ?? null,
        commentId: commentId ?? null,
        reason: reportReason,
        description: 'Farmer report from community page',
      })
      setFeedback('Report submitted to the moderation team.')
      setReportingId(null)
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : 'Unable to submit report.')
    }
  }

  return (
    <div className="community-page">
      <div className="module-header">
        <div>
          <span className="section-kicker">KISANAI FARM NETWORK</span>
          <h1>👨‍🌾 Farmer Community</h1>
          <p>Ask. Share. Learn. Grow together.</p>
        </div>
        <span className="community-members"><Users size={14} /> 2,480 farmers</span>
      </div>

      {signal && (
        <div className="local-problem">
          <AlertTriangle size={21} />
          <div>
            <strong># ⚠️ POSSIBLE CROP PROBLEM</strong>
            <p>Several farmers are reporting similar symptoms for {signal.crop}. <span>Community Signal — Requires Verification</span></p>
          </div>
          <button type="button" onClick={() => setCategory('All')}>See reports</button>
        </div>
      )}

      <section className="post-composer">
        <div className="composer-header">
          <div className="avatar">{(user?.name ?? 'ME').slice(0, 2).toUpperCase()}</div>
          <h3>What&apos;s happening on your farm?</h3>
        </div>

        <div className="composer-toolbar">
          <button type="button" onClick={() => setPostForm((current) => ({ ...current, content: current.content || 'My field is reporting...' }))}>📝 Write Post</button>
          <button type="button" onClick={() => document.getElementById('community-photo-input')?.click()}>📷 Add Photo</button>
          <select value={postForm.crop} onChange={(event) => setPostForm((current) => ({ ...current, crop: event.target.value }))} aria-label="Select crop">
            <option>Tomato</option>
            <option>Chilli</option>
            <option>Rice</option>
            <option>Cotton</option>
            <option>Maize</option>
          </select>
        </div>

        <textarea
          value={postForm.content}
          onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
          placeholder="My tomato leaves are turning yellow. What should I do?"
          aria-label="Write a post"
        />

        <div className="composer-fields">
          <select value={postForm.category} onChange={(event) => setPostForm((current) => ({ ...current, category: event.target.value }))}>
            {communityCategories.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input
            value={postForm.locationDistrict}
            onChange={(event) => setPostForm((current) => ({ ...current, locationDistrict: event.target.value }))}
            placeholder="District (optional)"
          />
        </div>

        {postForm.imagePreview && (
          <div className="image-preview-wrap">
            <img src={postForm.imagePreview} alt="Selected farm post" />
            <button type="button" className="image-remove" onClick={() => setPostForm((current) => ({ ...current, imageFile: null, imagePreview: '' }))}><X size={14} /> Remove image</button>
          </div>
        )}

        <div className="composer-actions">
          <input id="community-photo-input" type="file" accept="image/*" hidden onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            setPostForm((current) => ({ ...current, imageFile: file, imagePreview: URL.createObjectURL(file) }))
          }} />
          <button type="button" className="primary" onClick={() => void handleCreatePost()} disabled={submitting}>
            {submitting ? 'Posting...' : 'Create Post'}
          </button>
        </div>
      </section>

      {error && <div className="community-error">{error}</div>}
      {feedback && <div className="community-success">{feedback}</div>}

      <div className="community-tools">
        <label className="community-search">
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search post contents or crop" aria-label="Search community posts" />
        </label>

        <div className="community-toolbar-row">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categoryFilters.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option>Latest</option>
            <option>Most Helpful</option>
            <option>Most Commented</option>
          </select>
          <button type="button" className={showMyPostsOnly ? 'active-toggle' : ''} onClick={() => setShowMyPostsOnly((current) => !current)}>
            My Posts
          </button>
        </div>
      </div>

      <div className="community-feed">
        {loading ? (
          <div className="result-empty"><Sparkles size={22} /><h2>Loading community feed…</h2></div>
        ) : filteredPosts.length === 0 ? (
          <div className="result-empty"><Search size={22} /><h2>No posts found</h2><p>Try another crop or search term.</p></div>
        ) : (
          filteredPosts.map((post) => (
            <article className="community-post" key={post.id}>
              <div className="post-header">
                <div className="avatar">{post.farmer.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                <div>
                  <strong>{post.farmer}</strong>
                  <span>{post.location} · {new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <span className="crop-tag">{post.crop}</span>
              </div>

              <div className="post-meta-row">
                <span className="meta-badge">{post.category}</span>
                {post.status !== 'ACTIVE' && <span className="meta-badge warning">{post.status}</span>}
              </div>

              <p className="post-text">{post.content}</p>
              {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="Farm post" />}

              <div className="post-actions-row">
                <button type="button" className={post.helpfulByCurrentUser ? 'helpful selected' : 'helpful'} onClick={() => void handleHelpful(post.id)}>
                  <Heart size={15} /> Helpful <span>{post.helpfulCount}</span>
                </button>
                <span><MessageCircle size={15} /> {post.commentCount}</span>
                <button type="button" className="report-trigger" onClick={() => setReportingId(reportingId === post.id ? null : post.id)}>
                  <Flag size={15} /> Report
                </button>
              </div>

              {reportingId === post.id && (
                <div className="report-panel">
                  <select value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                    {reportReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                  </select>
                  <button type="button" onClick={() => void handleReport(post.id)}>Submit Report</button>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="comments-wrap">
                  {post.comments.map((comment) => (
                    <div className="comment-item" key={comment.id}>
                      <div className="comment-header">
                        <strong>{comment.farmer}</strong>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{comment.content}</p>
                      <div className="comment-footer">
                        <button type="button">Helpful</button>
                        {comment.userId === user?.id ? <button type="button">Edit</button> : <button type="button" onClick={() => void handleReport(undefined, comment.id)}><Flag size={13} /> Report</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form
                className="comment-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const draft = commentDrafts[post.id] ?? ''
                  void handleAddComment(post.id, draft)
                  setCommentDrafts((current) => ({ ...current, [post.id]: '' }))
                }}
              >
                <input
                  value={commentDrafts[post.id] ?? ''}
                  onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                  placeholder="Write a comment..."
                  aria-label="Write a comment"
                />
                <button type="submit"><Send size={14} /> Send</button>
              </form>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
