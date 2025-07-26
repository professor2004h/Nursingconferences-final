import { client } from './sanity/client';

// TypeScript interface for Custom Content Section
export interface CustomContentSectionData {
  _id: string;
  title: string;
  primaryText: string;
  insights: string;
  targets: string;
  showOnHomepage: boolean;
}

// Default content configuration
const getDefaultContent = (): CustomContentSectionData => ({
  _id: 'default',
  title: 'Default Custom Content Section',
  primaryText: 'INSIGHTS',
  insights: 'Being part of a Scientific Seminar is a professionally very rewarding and enriching experience. Apart from socializing with the greatest kinds from across the Globe, we get the insights to the realm of new global trends, the talking shapes in the Global research laboratories. These sessions inspire many a practitioner minds for new beginnings that have the potential to transform the way we live today. As individuals we constantly seeking to advance our careers, these knowledge sharing sessions function as gateways to a new realm of opportunities unseen before.',
  targets: 'We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses by enabling an ecosystem to key stake holders to express themselves their research findings. These research findings are the Critical links to shaping our future living – seen or unseen.',
  showOnHomepage: true,
});

// Get Custom Content Section data from Sanity CMS
export async function getCustomContentSectionData(): Promise<CustomContentSectionData> {
  try {
    console.log('📝 Fetching Custom Content Section Data...');

    const query = `*[_type == "customContentSection"][0]{
      _id,
      title,
      primaryText,
      insights,
      targets,
      showOnHomepage
    }`;

    console.log('🔍 Custom Content Data Query:', query);

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 0, // Force fresh data for debugging
        tags: ['custom-content-section']
      }
    });

    console.log('📝 Custom Content Section Raw Data:', JSON.stringify(data, null, 2));

    // If no data found, return default
    if (!data) {
      console.log('❌ No Custom Content data found, returning default');
      return getDefaultContent();
    }

    // Validate and return the data
    const processedData = {
      _id: data._id || 'default',
      title: data.title || 'Custom Content Section',
      primaryText: data.primaryText || 'INSIGHTS',
      insights: data.insights || 'Being part of a Scientific Seminar is a professionally very rewarding and enriching experience. Apart from socializing with the greatest kinds from across the Globe, we get the insights to the realm of new global trends, the talking shapes in the Global research laboratories. These sessions inspire many a practitioner minds for new beginnings that have the potential to transform the way we live today. As individuals we constantly seeking to advance our careers, these knowledge sharing sessions function as gateways to a new realm of opportunities unseen before.',
      targets: data.targets || 'We are the pioneers in connecting people – bringing in the best minds to the table to resolve complex global human concerns to deliver simple usable solutions. We are in the critical path of bringing scientific innovations to the masses by enabling an ecosystem to key stake holders to express themselves their research findings. These research findings are the Critical links to shaping our future living – seen or unseen.',
      showOnHomepage: data.showOnHomepage !== undefined ? data.showOnHomepage : true,
    };

    console.log('✅ Custom Content Section Data Processed:', JSON.stringify(processedData, null, 2));
    return processedData;

  } catch (error) {
    console.error('❌ Error fetching Custom Content section data:', error);
    return getDefaultContent();
  }
}


