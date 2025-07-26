// Migration script to create the unified conferences settings document
// Run this in Sanity Studio Vision tool or via CLI

const unifiedConferencesSettings = {
  _id: 'conferencesSectionSettings',
  _type: 'conferencesSectionSettings',
  masterControl: {
    showOnHomepage: true,
    title: 'Featured Conferences',
    description: [
      {
        _type: 'block',
        _key: 'desc1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'We connect the Thoughts to Realizations – we conduct seminars, conferences as annual events that brings-in cross section of the world to share their efforts that impact the world that we live, to fellow intellectuals and other professionals who are transforming this world with their ideas for a better future.'
          }
        ]
      }
    ]
  },
  displaySettings: {
    maxEventsToShow: 6,
    showOnlyActiveEvents: true,
    sortOrder: 'date_desc'
  }
};

// To run this migration:
// 1. Go to Sanity Studio Vision tool: http://localhost:3333/vision
// 2. Paste this query and run it:

/*
{
  "create": {
    "_id": "conferencesSectionSettings",
    "_type": "conferencesSectionSettings",
    "masterControl": {
      "showOnHomepage": true,
      "title": "Featured Conferences",
      "description": [
        {
          "_type": "block",
          "_key": "desc1",
          "style": "normal",
          "children": [
            {
              "_type": "span",
              "_key": "span1",
              "text": "We connect the Thoughts to Realizations – we conduct seminars, conferences as annual events that brings-in cross section of the world to share their efforts that impact the world that we live, to fellow intellectuals and other professionals who are transforming this world with their ideas for a better future."
            }
          ]
        }
      ]
    },
    "displaySettings": {
      "maxEventsToShow": 6,
      "showOnlyActiveEvents": true,
      "sortOrder": "date_desc"
    }
  }
}
*/

export default unifiedConferencesSettings;
