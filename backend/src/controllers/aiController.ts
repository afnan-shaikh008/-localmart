import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateProductDescription = async (req: Request, res: Response) => {
  try {
    const { title, keywords, category } = req.body;

    if (!title || !keywords) {
      return res.status(400).json({ success: false, message: 'Title and keywords are required' });
    }

    const prompt = `You are a professional e-commerce copywriter for a local marketplace called LocalMart.
    Write a compelling, high-converting product description for a product titled "${title}" in the "${category || 'general'}" category.
    Use these keywords: ${keywords.join(', ')}.
    Keep it professional yet friendly, highlighting local quality and authenticity.
    Format it in a few short paragraphs with a bulleted list of key features.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const description = completion.choices[0].message.content;
    res.status(200).json({ success: true, description });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ success: false, message: 'AI generation failed' });
  }
};

export const semanticSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });

    // 1. Generate embedding for the user query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: String(query),
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Use Supabase RPC to perform vector similarity search
    // We assume a function `match_products` exists in Postgres (defined in schema/docs)
    const { data, error } = await supabase.rpc('match_products', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 10,
    });

    if (error) return res.status(400).json({ success: false, message: error.message });

    // 3. Fetch full product details for the matching IDs
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*, profiles(username)')
      .in('id', data.map((item: any) => item.id));

    if (pError) return res.status(500).json({ success: false, message: pError.message });

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    console.error('Semantic Search Error:', error);
    res.status(500).json({ success: false, message: 'Semantic search failed' });
  }
};
