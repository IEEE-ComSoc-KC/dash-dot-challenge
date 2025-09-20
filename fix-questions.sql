-- Fix RLS policies for questions table
-- Run this in your Supabase SQL Editor

-- Temporarily disable RLS to insert questions
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Insert the questions
INSERT INTO public.questions (question_number, question_text, correct_answer) VALUES
(1, 'What is the morse code for ''Bitrate''?', '-... .. - .-. .- - .'),
(2, 'What is the morse code for ''Encryption''?', '. -. -.-. .-. -.-- .--. - .. --- -.'),
(3, 'What is the morse code for ''Synchronous''?', '... -.-- -. -.-. .... .-. --- -. --- ..- ...'),
(4, 'What is the morse code for ''Redundancy''?', '.-. . -.. ..- -. -.. .- -. -.-. -.--'),
(5, 'What is the morse code for ''Cryptotelephony''?', '-.-. .-. -.-- .--. - --- - . .-.. . .--. .... --- -. -.--')
ON CONFLICT (question_number) DO NOTHING;

-- Re-enable RLS with correct policies
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the policy to allow reading questions for everyone
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.questions;
CREATE POLICY "Anyone can view questions" 
ON public.questions 
FOR SELECT 
USING (true);

-- Verify the data
SELECT question_number, question_text FROM public.questions ORDER BY question_number;