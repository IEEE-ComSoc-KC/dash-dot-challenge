-- Complete Database Schema for Dash Dot Challenge
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_number INTEGER NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view questions" 
ON public.questions 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Create user_answers table to track timing and responses
CREATE TABLE public.user_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_taken_seconds INTEGER NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS for user_answers
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answers" 
ON public.user_answers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers" 
ON public.user_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" 
ON public.user_answers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Insert the morse code questions
INSERT INTO public.questions (question_number, question_text, correct_answer) VALUES
(1, 'What is the morse code for ''Bitrate''?', '-... .. - .-. .- - .'),
(2, 'What is the morse code for ''Encryption''?', '. -. -.-. .-. -.-- .--. - .. --- -.'),
(3, 'What is the morse code for ''Synchronous''?', '... -.-- -. -.-. .... .-. --- -. --- ..- ...'),
(4, 'What is the morse code for ''Redundancy''?', '.-. . -.. ..- -. -.. .- -. -.-. -.--'),
(5, 'What is the morse code for ''Cryptotelephony''?', '-.-. .-. -.-- .--. - --- - . .-.. . .--. .... --- -. -.--');

-- 5. Optional: User progress tracking table
CREATE TABLE public.user_progress (
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

-- 6. Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 7. Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 
    new.email
  );
  RETURN new;
END;
$$;

-- 9. Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();