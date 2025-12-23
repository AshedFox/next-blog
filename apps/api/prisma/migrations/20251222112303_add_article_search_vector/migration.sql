CREATE OR REPLACE FUNCTION extract_text_from_segments(segments jsonb) 
RETURNS text AS $$
BEGIN
    RETURN (
        SELECT string_agg(elem ->> 'text', ' ')
        FROM jsonb_array_elements(segments) AS elem
        WHERE elem ->> 'type' = 'TEXT'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION extract_article_content(blocks jsonb) 
RETURNS text AS $$
DECLARE
    block jsonb;
    result_text text := '';
    chunk text;
BEGIN
    IF blocks IS NULL OR jsonb_typeof(blocks) != 'array' THEN
        RETURN '';
    END IF;

    FOR block IN SELECT * FROM jsonb_array_elements(blocks) LOOP
        chunk := '';
        
        CASE block ->> 'type'
            WHEN 'PARAGRAPH', 'HEADING' THEN
                chunk := extract_text_from_segments(block -> 'content');

            WHEN 'QUOTE' THEN
                chunk := extract_text_from_segments(block -> 'content') || ' ' || 
                         COALESCE(block ->> 'author', '');

            WHEN 'CODE' THEN
                chunk := COALESCE(block ->> 'content', '') || ' ' || 
                         COALESCE(block ->> 'language', '');

            WHEN 'IMAGE' THEN
                chunk := COALESCE(block ->> 'alt', '');

            WHEN 'LIST' THEN
                SELECT string_agg(extract_text_from_segments(item -> 'content'), ' ')
                INTO chunk
                FROM jsonb_array_elements(block -> 'items') AS item;

            ELSE
                chunk := '';
        END CASE;

        IF chunk IS NOT NULL AND chunk != '' THEN
            result_text := result_text || ' ' || chunk;
        END IF;
    END LOOP;

    RETURN TRIM(result_text);
END;
$$ LANGUAGE plpgsql IMMUTABLE;


ALTER TABLE "Article"
ADD COLUMN "searchVector" tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') || 
    setweight(to_tsvector('russian', COALESCE(title, '')), 'A') || 
    setweight(to_tsvector('english', extract_article_content(blocks)), 'B') ||
    setweight(to_tsvector('russian', extract_article_content(blocks)), 'B')
) STORED;

CREATE INDEX "Article_searchVector_idx" ON "Article" USING GIN ("searchVector");