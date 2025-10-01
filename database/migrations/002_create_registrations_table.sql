-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    bidang text NOT NULL,
    team_a1 text NOT NULL,
    phone_a1 text NOT NULL,
    team_a2 text,
    phone_a2 text,
    team_b1 text,
    phone_b1 text,
    team_b2 text,
    phone_b2 text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'added_to_tournament', 'rejected')),
    tournament_id uuid REFERENCES public.tournaments(id) ON DELETE SET NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);

-- Create index on bidang for filtering by department
CREATE INDEX IF NOT EXISTS idx_registrations_bidang ON public.registrations(bidang);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);

-- Create index on tournament_id for joining with tournaments
CREATE INDEX IF NOT EXISTS idx_registrations_tournament_id ON public.registrations(tournament_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust based on your auth setup)
-- For now, allow all operations (you can restrict this later based on user roles)
CREATE POLICY "Allow all operations for registrations" ON public.registrations
    FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some example data (optional, for testing)
-- You can remove this section if you don't want example data
/*
INSERT INTO public.registrations (email, bidang, team_a1, phone_a1, team_a2, phone_a2, status) VALUES
('john.doe@company.com', 'IT Department', 'John Doe', '+6281234567890', 'Jane Smith', '+6281234567891', 'pending'),
('admin@hr.com', 'HR Department', 'HR Admin', '+6281234567892', NULL, NULL, 'approved');
*/