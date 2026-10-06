import { supabase, supabaseConfigured } from '../lib/supabase'

export type CommunityCategory = 'Crop Problem' | 'Disease' | 'Pest' | 'Irrigation' | 'Soil' | 'Weather' | 'Market & Price' | 'Machinery' | 'Farming Tips' | 'Success Story' | 'General Question'
export type CommunityStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED' | 'UNDER_REVIEW'
export type CommunityReportReason = 'Spam' | 'Wrong information' | 'Abusive content' | 'Scam' | 'Irrelevant' | 'Other' | 'Abuse'

export type CommunityComment = {
  id: string
  postId: string
  userId: string
  farmer: string
  content: string
  createdAt: string
  updatedAt?: string
  status: CommunityStatus
  helpfulCount: number
  helpfulByCurrentUser: boolean
  canEdit: boolean
  canDelete: boolean
  reporterId?: string
}

export type CommunityPost = {
  id: string
  farmer: string
  farmerId: string
  crop: string
  category: string
  location: string
  content: string
  imageUrl?: string | null
  status: CommunityStatus
  createdAt: string
  updatedAt?: string
  helpfulCount: number
  helpfulByCurrentUser: boolean
  commentCount: number
  comments: CommunityComment[]
}

export type CommunityReport = {
  id: string
  reported_by: string
  reporter_name?: string
  post_id?: string | null
  comment_id?: string | null
  reason: string
  description?: string | null
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'RESOLVED' | 'HIDDEN'
  created_at: string
  reviewed_at?: string | null
  reviewed_by?: string | null
  contentPreview?: string
}

const demoFeed: CommunityPost[] = [
  {
    id: 'demo-post-1',
    farmer: 'Suma R.',
    farmerId: 'farmer-demo-1',
    crop: 'Tomato',
    category: 'Crop Problem',
    location: 'Nalgonda',
    content: 'My tomato leaves are turning yellow. What should I do?',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80',
    status: 'ACTIVE',
    createdAt: '2026-08-28T09:15:00.000Z',
    helpfulCount: 18,
    helpfulByCurrentUser: false,
    commentCount: 1,
    comments: [{
      id: 'demo-comment-1',
      postId: 'demo-post-1',
      userId: 'farmer-demo-2',
      farmer: 'Ravi K.',
      content: 'I had a similar issue; checking the soil moisture helped.',
      createdAt: '2026-08-28T09:45:00.000Z',
      status: 'ACTIVE',
      helpfulCount: 3,
      helpfulByCurrentUser: false,
      canEdit: false,
      canDelete: false,
    }],
  },
  {
    id: 'demo-post-2',
    farmer: 'Ravi K.',
    farmerId: 'farmer-demo-2',
    crop: 'Chilli',
    category: 'Pest',
    location: 'Suryapet',
    content: 'The chilli leaves are curling and there are tiny white spots. Could this be thrips?',
    status: 'ACTIVE',
    createdAt: '2026-08-27T18:40:00.000Z',
    helpfulCount: 11,
    helpfulByCurrentUser: false,
    commentCount: 0,
    comments: [],
  },
]
let demoState = [...demoFeed]

export const communityCategories: CommunityCategory[] = [
  'Crop Problem',
  'Disease',
  'Pest',
  'Irrigation',
  'Soil',
  'Weather',
  'Market & Price',
  'Machinery',
  'Farming Tips',
  'Success Story',
  'General Question',
]

export const communitySortOptions = ['Latest', 'Most Helpful', 'Most Commented', 'My Posts'] as const

export function detectLocalProblem(posts: CommunityPost[]) {
  const counts = new Map<string, number>()
  posts.forEach((post) => {
    if (post.status !== 'ACTIVE') return
    const key = `${post.crop}:reported`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  const match = [...counts.entries()].find(([, count]) => count > 1)
  if (!match) return null
  return { crop: match[0].split(':')[0], count: match[1] }
}

function getDemoUser() {
  return { id: 'demo-farmer-id', email: 'farmer@demo.local', name: 'Demo Farmer', role: 'FARMER' as const, location: 'Nalgonda' }
}

function formatPostFromRow(row: any): CommunityPost {
  return {
    id: row.id,
    farmer: row.profiles?.full_name ?? 'Farmer',
    farmerId: row.user_id,
    crop: row.crop ?? 'General',
    category: row.category ?? 'General Question',
    location: row.location_district ?? row.profiles?.district ?? 'District',
    content: row.content ?? '',
    imageUrl: row.image_url ?? null,
    status: row.status ?? 'ACTIVE',
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at,
    helpfulCount: row.helpful_count ?? 0,
    helpfulByCurrentUser: Boolean(row.helpful_by_current_user),
    commentCount: row.comment_count ?? 0,
    comments: [],
  }
}

async function getCurrentUser() {
  if (!supabaseConfigured) return getDemoUser()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Please sign in to continue.')
  return { id: data.user.id, email: data.user.email ?? '', name: data.user.email ?? 'Farmer', role: 'FARMER' as const, location: 'District' }
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  if (!supabaseConfigured) {
    return demoState
  }

  const { data, error } = await supabase
    .from('community_posts')
    .select('*, profiles:user_id(full_name, district), post_helpful!left(id, user_id), community_comments!left(id)')
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  const postIds = data.map((row) => row.id)
  const { data: commentsData, error: commentsError } = await supabase
    .from('community_comments')
    .select('*, profiles:user_id(full_name)')
    .in('post_id', postIds)
    .order('created_at', { ascending: true })

  if (commentsError) throw commentsError

  return data.map((row) => {
    const comments = (commentsData ?? []).filter((comment) => comment.post_id === row.id).map((comment) => ({
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      farmer: comment.profiles?.full_name ?? 'Farmer',
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      status: comment.status ?? 'ACTIVE',
      helpfulCount: 0,
      helpfulByCurrentUser: false,
      canEdit: false,
      canDelete: false,
    }))

    return {
      ...formatPostFromRow(row),
      comments,
      commentCount: comments.length,
      helpfulCount: row.post_helpful?.length ?? 0,
    }
  })
}

export async function createCommunityPost(input: {
  content: string
  crop: string
  category: string
  imageFile?: File | null
  locationDistrict?: string
}) {
  const user = await getCurrentUser()
  if (!input.content.trim()) throw new Error('Post content is required.')

  if (!supabaseConfigured) {
    const post: CommunityPost = {
      id: `demo-post-${Date.now()}`,
      farmer: user.name,
      farmerId: user.id,
      crop: input.crop || 'General',
      category: input.category || 'General Question',
      location: input.locationDistrict || 'Your district',
      content: input.content.trim(),
      imageUrl: input.imageFile ? URL.createObjectURL(input.imageFile) : null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      helpfulByCurrentUser: false,
      commentCount: 0,
      comments: [],
    }
    demoState = [post, ...demoState]
    return post
  }

  let imageUrl: string | null = null
  if (input.imageFile) {
    const fileName = `${Date.now()}-${input.imageFile.name.replace(/\s+/g, '-')}`
    const { data: uploaded, error: uploadError } = await supabase.storage.from('community-images').upload(fileName, input.imageFile, { upsert: false })
    if (uploadError) throw new Error(uploadError.message || 'Image upload failed.')
    const { data: publicData } = supabase.storage.from('community-images').getPublicUrl(uploaded.path)
    imageUrl = publicData.publicUrl
  }

  const { data, error } = await supabase.from('community_posts').insert({
    user_id: user.id,
    content: input.content.trim(),
    crop: input.crop || 'General',
    category: input.category || 'General Question',
    image_url: imageUrl,
    location_district: input.locationDistrict || null,
    status: 'ACTIVE',
  }).select('*, profiles:user_id(full_name, district)').single()

  if (error) throw error
  return formatPostFromRow(data)
}

export async function toggleHelpfulPost(postId: string) {
  if (!supabaseConfigured) {
    demoState = demoState.map((post) => {
      if (post.id !== postId) return post
      const isHelpful = !post.helpfulByCurrentUser
      return { ...post, helpfulByCurrentUser: isHelpful, helpfulCount: Math.max(0, post.helpfulCount + (isHelpful ? 1 : -1)) }
    })
    return demoState.find((post) => post.id === postId)
  }

  const user = await getCurrentUser()
  const { data: existing, error: existingError } = await supabase
    .from('post_helpful')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) throw existingError

  if (existing) {
    const { error } = await supabase.from('post_helpful').delete().eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('post_helpful').insert({ post_id: postId, user_id: user.id })
    if (error) throw error
  }

  return true
}

export async function addCommentToPost(postId: string, content: string) {
  if (!content.trim()) throw new Error('Comment cannot be empty.')

  const user = await getCurrentUser()

  if (!supabaseConfigured) {
    const comment: CommunityComment = {
      id: `demo-comment-${Date.now()}`,
      postId,
      userId: user.id,
      farmer: user.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      helpfulCount: 0,
      helpfulByCurrentUser: false,
      canEdit: true,
      canDelete: true,
    }
    demoState = demoState.map((post) => post.id === postId ? { ...post, comments: [...post.comments, comment], commentCount: post.commentCount + 1 } : post)
    return comment
  }

  const { data, error } = await supabase.from('community_comments').insert({
    post_id: postId,
    user_id: user.id,
    content: content.trim(),
    status: 'ACTIVE',
  }).select('*, profiles:user_id(full_name)').single()

  if (error) throw error
  return {
    id: data.id,
    postId: data.post_id,
    userId: data.user_id,
    farmer: data.profiles?.full_name ?? user.name,
    content: data.content,
    createdAt: data.created_at,
    status: data.status ?? 'ACTIVE',
    helpfulCount: 0,
    helpfulByCurrentUser: false,
    canEdit: true,
    canDelete: true,
  } satisfies CommunityComment
}

export async function updateComment(commentId: string, content: string) {
  if (!supabaseConfigured) {
    demoState = demoState.map((post) => ({
      ...post,
      comments: post.comments.map((comment) => comment.id === commentId ? { ...comment, content, updatedAt: new Date().toISOString() } : comment),
    }))
    return true
  }

  const { error } = await supabase.from('community_comments').update({ content: content.trim(), updated_at: new Date().toISOString() }).eq('id', commentId)
  if (error) throw error
  return true
}

export async function deleteComment(commentId: string) {
  if (!supabaseConfigured) {
    demoState = demoState.map((post) => ({ ...post, comments: post.comments.filter((comment) => comment.id !== commentId), commentCount: Math.max(0, post.commentCount - 1) }))
    return true
  }
  const { error } = await supabase.from('community_comments').delete().eq('id', commentId)
  if (error) throw error
  return true
}

export async function createCommunityReport(input: {
  postId?: string | null
  commentId?: string | null
  reason: string
  description?: string | null
}) {
  const user = await getCurrentUser()
  if (!supabaseConfigured) {
    return { success: true }
  }
  const { error } = await supabase.from('community_reports').insert({
    reported_by: user.id,
    post_id: input.postId ?? null,
    comment_id: input.commentId ?? null,
    reason: input.reason,
    description: input.description ?? null,
    status: 'PENDING',
  })
  if (error) throw error
  return { success: true }
}

export async function fetchCommunityReports(): Promise<CommunityReport[]> {
  if (!supabaseConfigured) {
    return [
      { id: 'demo-report-1', reported_by: 'farmer-demo-2', reporter_name: 'Ravi K.', post_id: 'demo-post-1', reason: 'Wrong information', status: 'PENDING', created_at: '2026-08-28T10:00:00.000Z', contentPreview: 'Tomato leaves turning yellow' },
    ]
  }

  const { data, error } = await supabase.from('community_reports').select('*, profiles:reported_by(full_name)').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    reported_by: row.reported_by,
    reporter_name: row.profiles?.full_name ?? 'Farmer',
    post_id: row.post_id,
    comment_id: row.comment_id,
    reason: row.reason,
    description: row.description,
    status: row.status ?? 'PENDING',
    created_at: row.created_at,
    reviewed_at: row.reviewed_at,
    reviewed_by: row.reviewed_by,
    contentPreview: row.description ?? 'Community report',
  }))
}

export async function updatePostModeration(postId: string, status: CommunityStatus) {
  if (!supabaseConfigured) {
    demoState = demoState.map((post) => post.id === postId ? { ...post, status } : post)
    return true
  }
  const { error } = await supabase.from('community_posts').update({ status, updated_at: new Date().toISOString() }).eq('id', postId)
  if (error) throw error
  return true
}

export async function updateCommentModeration(commentId: string, status: CommunityStatus) {
  if (!supabaseConfigured) {
    demoState = demoState.map((post) => ({ ...post, comments: post.comments.map((comment) => comment.id === commentId ? { ...comment, status } : comment) }))
    return true
  }
  const { error } = await supabase.from('community_comments').update({ status, updated_at: new Date().toISOString() }).eq('id', commentId)
  if (error) throw error
  return true
}

export async function resolveReport(reportId: string, status: 'REVIEWED' | 'DISMISSED' | 'RESOLVED' | 'HIDDEN') {
  if (!supabaseConfigured) return true
  const { error } = await supabase.from('community_reports').update({ status, reviewed_at: new Date().toISOString() }).eq('id', reportId)
  if (error) throw error
  return true
}

export async function fetchAdminCommunitySummary() {
  const posts = await fetchCommunityPosts()
  const reports = await fetchCommunityReports()
  const comments = posts.reduce((total, post) => total + post.comments.length, 0)
  const totalPosts = posts.length
  const postsToday = posts.filter((post) => {
    const date = new Date(post.createdAt)
    const now = new Date()
    return date.toDateString() === now.toDateString()
  }).length
  const hiddenPosts = posts.filter((post) => post.status === 'HIDDEN').length
  const pendingModeration = posts.filter((post) => post.status === 'UNDER_REVIEW').length + reports.filter((report) => report.status === 'PENDING').length

  return {
    totalPosts,
    postsToday,
    comments,
    reports: reports.length,
    pendingModeration,
    hiddenPosts,
  }
}

export type CommunitySignal = { crop: string; reports: number; symptoms: string[]; district: string | null; status: string }

export function detectCommunitySignal(posts: CommunityPost[]): CommunitySignal | null {
  const grouped = new Map<string, { crop: string; count: number; symptoms: Set<string>; districts: Set<string> }>()
  posts.forEach((post) => {
    if (!post.content || post.status !== 'ACTIVE') return
    const crop = post.crop
    const entry = grouped.get(crop) ?? { crop, count: 0, symptoms: new Set<string>(), districts: new Set<string>() }
    entry.count += 1
    const keywords = post.content.toLowerCase().split(/\s+/).filter((word) => word.length > 5)
    keywords.slice(0, 3).forEach((word) => entry.symptoms.add(word))
    if (post.location) entry.districts.add(post.location)
    grouped.set(crop, entry)
  })

  const signal = [...grouped.values()].find((entry) => entry.count >= 2)
  if (!signal) return null
  return {
    crop: signal.crop,
    reports: signal.count,
    symptoms: [...signal.symptoms].slice(0, 3),
    district: signal.districts.size === 1 ? [...signal.districts][0] : (signal.districts.size > 1 ? 'Multiple districts' : null),
    status: 'Community Signal — Requires Verification',
  }
}

export { demoState as demoCommunityPosts }