import { client } from './sanity/client';

// TypeScript interface for Journal Content
export interface JournalContent {
  _id: string;
  matterDescription?: string;
  showJournal?: boolean;
}

// Get Journal Content from siteSettings only
export async function getJournalContent(): Promise<JournalContent | null> {
  try {
    console.log('📰 Fetching Journal Content from Site Settings...');

    // Get content from siteSettings only
    const siteSettingsQuery = `*[_type == "siteSettings"][0]{
      _id,
      "matterDescription": journal.matterDescription,
      "showJournal": journal.showJournal
    }`;

    console.log('🔍 Site Settings Query:', siteSettingsQuery);

    const siteSettingsData = await client.fetch(siteSettingsQuery, {}, {
      next: {
        revalidate: 0, // Force fresh data for debugging
        tags: ['site-settings']
      }
    });

    console.log('📰 Site Settings Data:', JSON.stringify(siteSettingsData, null, 2));

    // Return the data from siteSettings only
    const journalContent: JournalContent = {
      _id: siteSettingsData?._id || 'default',
      matterDescription: siteSettingsData?.matterDescription,
      showJournal: siteSettingsData?.showJournal
    };

    console.log('✅ Journal Content from Site Settings:', JSON.stringify(journalContent, null, 2));

    return journalContent;

  } catch (error) {
    console.error('❌ Error fetching Journal content:', error);
    return null;
  }
}

// Helper function to check if journal should be displayed
export function shouldShowJournal(journalContent: JournalContent | null): boolean {
  return journalContent?.showJournal === true;
}

// Helper function to get journal matter description
export function getJournalMatterDescription(journalContent: JournalContent | null): string | null {
  return journalContent?.matterDescription || null;
}
