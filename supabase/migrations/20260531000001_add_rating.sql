-- Add rating column to reviews and review_edits
ALTER TABLE reviews ADD COLUMN rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE review_edits ADD COLUMN rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5);
