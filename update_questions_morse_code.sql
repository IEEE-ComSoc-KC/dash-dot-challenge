-- Update questions with new morse code challenges
-- This is optional since the app now uses localStorage, but kept for database consistency

-- Clear existing questions
DELETE FROM public.questions;

-- Insert new morse code questions
INSERT INTO public.questions (question_number, question_text, correct_answer) VALUES
(1, 'What is the morse code for ''Bitrate''?', '-... .. - .-. .- - .'),
(2, 'What is the morse code for ''Encryption''?', '. -. -.-. .-. -.-- .--. - .. --- -.'),
(3, 'What is the morse code for ''Synchronous''?', '... -.-- -. -.-. .... .-. --- -. --- ..- ...'),
(4, 'What is the morse code for ''Redundancy''?', '.-. . -.. ..- -. -.. .- -. -.-. -.--'),
(5, 'What is the morse code for ''Cryptotelephony''?', '-.-. .-. -.-- .--. - --- - . .-.. . .--. .... --- -. -.--');

-- Optional: Add a table to track user progress if needed later
-- CREATE TABLE IF NOT EXISTS public.user_progress (
--   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
--   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   current_question_index INTEGER NOT NULL DEFAULT 0,
--   answers JSONB NOT NULL DEFAULT '{}',
--   completed_questions INTEGER[] NOT NULL DEFAULT '{}',
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   UNIQUE(user_id)
-- );