-- Update questions with new morse code challenges
-- This is optional since the app now uses a hybrid approach with localStorage fallback
-- Apply this when you have database dashboard access

-- Clear existing questions (if any)
DELETE FROM public.questions;

-- Insert new morse code questions
INSERT INTO public.questions (question_number, question_text, correct_answer) VALUES
(1, 'What is the morse code for ''Bitrate''?', '-... .. - .-. .- - .'),
(2, 'What is the morse code for ''Encryption''?', '. -. -.-. .-. -.-- .--. - .. --- -.'),
(3, 'What is the morse code for ''Synchronous''?', '... -.-- -. -.-. .... .-. --- -. --- ..- ...'),
(4, 'What is the morse code for ''Redundancy''?', '.-. . -.. ..- -. -.. .- -. -.-. -.--'),
(5, 'What is the morse code for ''Cryptotelephony''?', '-.-. .-. -.-- .--. - --- - . .-.. . .--. .... --- -. -.--');

-- Update the existing user_answers table to use string question_id for compatibility
-- (This might be needed if your existing setup uses UUIDs)
-- ALTER TABLE public.user_answers ALTER COLUMN question_id TYPE text;

-- Ensure RLS policies are in place
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Update policies if needed
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.questions;
CREATE POLICY "Authenticated users can view questions" 
ON public.questions 
FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can view their own answers" ON public.user_answers;
CREATE POLICY "Users can view their own answers" 
ON public.user_answers 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own answers" ON public.user_answers;
CREATE POLICY "Users can insert their own answers" 
ON public.user_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow upsert for retries
DROP POLICY IF EXISTS "Users can update their own answers" ON public.user_answers;
CREATE POLICY "Users can update their own answers" 
ON public.user_answers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Optional: Add a table to track user progress if needed for analytics
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_questions INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress" 
ON public.user_progress 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);