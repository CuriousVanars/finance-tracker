-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense', 'saving')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense', 'saving')) NOT NULL,
    budgeted_amount DECIMAL(12,2) DEFAULT 0,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name, type)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    deadline DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense', 'saving')) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can only see their own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for categories
CREATE POLICY "Users can only see their own categories" ON public.categories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can only see their own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- Insert default categories for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default expense categories
  INSERT INTO public.categories (user_id, name, type, budgeted_amount, color) VALUES
    (NEW.id, 'Food & Dining', 'expense', 500, '#FF6B6B'),
    (NEW.id, 'Transportation', 'expense', 300, '#4ECDC4'),
    (NEW.id, 'Shopping', 'expense', 200, '#45B7D1'),
    (NEW.id, 'Entertainment', 'expense', 150, '#96CEB4'),
    (NEW.id, 'Bills & Utilities', 'expense', 400, '#FFEAA7'),
    (NEW.id, 'Healthcare', 'expense', 200, '#DDA0DD'),
    (NEW.id, 'Education', 'expense', 100, '#98D8C8');
  
  -- Insert default income categories
  INSERT INTO public.categories (user_id, name, type, budgeted_amount, color) VALUES
    (NEW.id, 'Salary', 'income', 3000, '#2ECC71'),
    (NEW.id, 'Freelance', 'income', 500, '#27AE60'),
    (NEW.id, 'Investment', 'income', 200, '#1ABC9C'),
    (NEW.id, 'Other Income', 'income', 100, '#16A085');
  
  -- Insert default saving categories
  INSERT INTO public.categories (user_id, name, type, budgeted_amount, color) VALUES
    (NEW.id, 'Emergency Fund', 'saving', 500, '#E74C3C'),
    (NEW.id, 'Vacation', 'saving', 300, '#9B59B6'),
    (NEW.id, 'Investment', 'saving', 400, '#3498DB'),
    (NEW.id, 'Retirement', 'saving', 600, '#34495E');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON public.transactions(date);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON public.transactions(type);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON public.goals(user_id);
