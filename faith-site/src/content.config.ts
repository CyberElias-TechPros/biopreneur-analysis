import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './articles' }),
  schema: z.object({
    day: z.number().int().min(1).max(365),
    slateMonth: z.number().int().min(1).max(12),
    slateArc: z.string(),
    title: z.string(),
    seoTitle: z.string().max(60),
    description: z.string().min(140).max(158),
    slug: z.string(),
    pubDate: z.string(),
    updatedDate: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    themeScripture: z.object({
      text: z.string(),
      reference: z.string(),
      translation: z.string(),
    }),
    centralTruth: z.string(),
    reaffirmation: z.string(),
    declaration: z.string(),
    furtherStudy: z.array(z.string()),
    relatedTeachings: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        category: z.string(),
        handoff: z.string(),
      })
    ),
    glossaryTerms: z.array(z.string()),
    featuredImageAlt: z.string(),
  }),
});

export const collections = { articles };
