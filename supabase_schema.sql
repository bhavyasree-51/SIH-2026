-- ============================================================================
-- Kisan Mitra (Smart Krishi) - 100% Safe, Idempotent Supabase Policies
-- Drop and recreate policies safely with ZERO duplicate errors
-- ============================================================================

-- 1. Enable RLS on all tables first
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.farm_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.disease_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.farm_reminders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Profiles Policies
-- ============================================================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- ============================================================================
-- 3. Farms Policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
CREATE POLICY "Users can view their own farms" 
ON public.farms FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own farms" ON public.farms;
CREATE POLICY "Users can insert their own farms" 
ON public.farms FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
CREATE POLICY "Users can update their own farms" 
ON public.farms FOR UPDATE 
USING (auth.uid() = user_id);

-- ============================================================================
-- 4. Farm Crops Policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own farm crops" ON public.farm_crops;
CREATE POLICY "Users can view own farm crops" 
ON public.farm_crops FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own farm crops" ON public.farm_crops;
CREATE POLICY "Users can insert own farm crops" 
ON public.farm_crops FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.user_id = auth.uid()));

-- ============================================================================
-- 5. Disease Scans Policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own disease scans" ON public.disease_scans;
CREATE POLICY "Users can view own disease scans" 
ON public.disease_scans FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert disease scans" ON public.disease_scans;
CREATE POLICY "Users can insert disease scans" 
ON public.disease_scans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. Community Posts Policies (Public forum)
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view active posts" ON public.community_posts;
CREATE POLICY "Anyone can view active posts" 
ON public.community_posts FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
CREATE POLICY "Authenticated users can create posts" 
ON public.community_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts" 
ON public.community_posts FOR UPDATE 
USING (auth.uid() = user_id);

-- ============================================================================
-- 7. Community Comments Policies
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view comments" ON public.community_comments;
CREATE POLICY "Anyone can view comments" 
ON public.community_comments FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can comment" ON public.community_comments;
CREATE POLICY "Authenticated users can comment" 
ON public.community_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.community_comments;
CREATE POLICY "Users can update their own comments" 
ON public.community_comments FOR UPDATE 
USING (auth.uid() = user_id);

-- ============================================================================
-- 8. Post Helpful (Likes) Policies
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view post helpful votes" ON public.post_helpful;
CREATE POLICY "Anyone can view post helpful votes" 
ON public.post_helpful FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can like/unlike posts" ON public.post_helpful;
CREATE POLICY "Users can like/unlike posts" 
ON public.post_helpful FOR ALL 
USING (auth.uid() = user_id);

-- ============================================================================
-- 9. Community Reports (Volunteer Moderation)
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can submit reports" ON public.community_reports;
CREATE POLICY "Authenticated users can submit reports" 
ON public.community_reports FOR INSERT 
WITH CHECK (auth.uid() = reported_by);

DROP POLICY IF EXISTS "Volunteers can view reports" ON public.community_reports;
CREATE POLICY "Volunteers can view reports" 
ON public.community_reports FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Volunteers can update reports" ON public.community_reports;
CREATE POLICY "Volunteers can update reports" 
ON public.community_reports FOR UPDATE 
USING (true);

-- ============================================================================
-- 10. Farm Reminders Policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage their own reminders" ON public.farm_reminders;
CREATE POLICY "Users can manage their own reminders" 
ON public.farm_reminders FOR ALL 
USING (auth.uid() = user_id);
