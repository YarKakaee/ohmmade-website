/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT floor(random() * 90000000) + 10000000;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Create a temporary function to generate unique usernames
CREATE OR REPLACE FUNCTION generate_unique_username(email TEXT)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  username TEXT;
  counter INTEGER := 1;
  username_exists BOOLEAN;
BEGIN
  -- Extract username from email or use "user" if no email
  IF email IS NULL OR email = '' THEN
    base_username := 'user';
  ELSE
    base_username := LOWER(SPLIT_PART(email, '@', 1));
  END IF;

  -- Remove non-alphanumeric characters
  base_username := REGEXP_REPLACE(base_username, '[^a-z0-9_]', '', 'g');
  
  -- Ensure it starts with a letter
  IF base_username ~ '^[0-9]' THEN
    base_username := 'u' || base_username;
  END IF;
  
  -- Ensure minimum length
  IF LENGTH(base_username) < 3 THEN
    base_username := base_username || '000';
    base_username := SUBSTRING(base_username, 1, 3);
  END IF;
  
  -- Limit length
  base_username := SUBSTRING(base_username, 1, 20);
  
  -- Initial username attempt
  username := base_username;
  
  -- Check if exists and add numbers until unique
  LOOP
    EXECUTE 'SELECT EXISTS(SELECT 1 FROM "User" WHERE username = $1)' INTO username_exists USING username;
    EXIT WHEN NOT username_exists;
    counter := counter + 1;
    username := base_username || counter::TEXT;
  END LOOP;
  
  RETURN username;
END;
$$ LANGUAGE plpgsql;

-- Update existing users with generated usernames
UPDATE "User" SET username = generate_unique_username(email) WHERE username IS NULL;

-- Drop the temporary function
DROP FUNCTION generate_unique_username;

-- Now make the username column unique 
ALTER TABLE "User" ADD CONSTRAINT "User_username_key" UNIQUE ("username");

-- In a separate migration, we'll make it NOT NULL
