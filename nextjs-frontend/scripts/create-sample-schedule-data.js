// Sample data creation script for Event Schedule and Participation Benefits
// Run this in Sanity Studio's Vision tool or use the Sanity CLI

const sampleEventSchedule = {
  _type: 'eventSchedule',
  title: 'Schedule',
  isActive: true,
  displayOrder: 1,
  days: [
    {
      _type: 'day',
      dayNumber: 1,
      date: '2025-08-04',
      displayDate: 'August 04, 2025',
      sessions: [
        {
          _type: 'session',
          startTime: '08:00',
          endTime: '09:00',
          title: 'Registration',
          description: 'Conference registration and welcome reception',
          type: 'registration',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '09:00',
          endTime: '09:30',
          title: 'Opening Ceremony And Introduction',
          description: 'Welcome address and conference overview',
          type: 'opening',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '09:30',
          endTime: '10:30',
          title: 'Keynote Session I',
          description: 'Featured keynote presentation by renowned expert',
          type: 'keynote',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '10:30',
          endTime: '11:00',
          title: 'Refreshment Break',
          description: 'Coffee break and networking opportunity',
          type: 'break',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '11:00',
          endTime: '12:30',
          title: 'Keynote Session II',
          description: 'Second keynote presentation',
          type: 'keynote',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '12:30',
          endTime: '13:00',
          title: 'Plenary Session I',
          description: 'Interactive plenary discussion',
          type: 'plenary',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '13:00',
          endTime: '14:00',
          title: 'Lunch Break',
          description: 'Networking lunch with fellow attendees',
          type: 'lunch',
          isHighlighted: false
        }
      ]
    },
    {
      _type: 'day',
      dayNumber: 2,
      date: '2025-08-05',
      displayDate: 'August 05, 2025',
      sessions: [
        {
          _type: 'session',
          startTime: '09:00',
          endTime: '10:00',
          title: 'Keynote Session III',
          description: 'Opening keynote for day two',
          type: 'keynote',
          isHighlighted: true
        },
        {
          _type: 'session',
          startTime: '10:00',
          endTime: '11:00',
          title: 'Workshop Sessions',
          description: 'Parallel workshop sessions',
          type: 'workshop',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '11:00',
          endTime: '11:30',
          title: 'Coffee Break',
          description: 'Morning refreshment break',
          type: 'break',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '11:30',
          endTime: '12:30',
          title: 'Panel Discussion',
          description: 'Expert panel on current trends',
          type: 'panel',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '12:30',
          endTime: '13:30',
          title: 'Lunch & Networking',
          description: 'Final networking lunch',
          type: 'lunch',
          isHighlighted: false
        },
        {
          _type: 'session',
          startTime: '13:30',
          endTime: '14:30',
          title: 'Closing Ceremony',
          description: 'Conference wrap-up and awards',
          type: 'closing',
          isHighlighted: true
        }
      ]
    }
  ]
};

const sampleParticipationBenefits = {
  _type: 'participationBenefits',
  title: 'Participation Benefits',
  isActive: true,
  subtitle: 'What you get when you join our conference',
  displayOrder: 1,
  maxHeight: '400px',
  backgroundColor: 'white',
  benefits: [
    {
      _type: 'benefit',
      title: 'All programs entry',
      description: 'Access to all conference sessions, workshops, and presentations',
      icon: 'check',
      isHighlighted: false,
      displayOrder: 1
    },
    {
      _type: 'benefit',
      title: 'Reception banquet',
      description: 'Welcome reception and networking dinner',
      icon: 'food',
      isHighlighted: false,
      displayOrder: 2
    },
    {
      _type: 'benefit',
      title: '2 Coffee breaks and snacks during the two days',
      description: 'Refreshments and networking opportunities throughout the event',
      icon: 'coffee',
      isHighlighted: false,
      displayOrder: 3
    },
    {
      _type: 'benefit',
      title: 'Handbook',
      description: 'Comprehensive conference handbook with all session details',
      icon: 'book',
      isHighlighted: false,
      displayOrder: 4
    },
    {
      _type: 'benefit',
      title: 'Lunch during the conference',
      description: 'Catered lunch on both conference days',
      icon: 'food',
      isHighlighted: false,
      displayOrder: 5
    },
    {
      _type: 'benefit',
      title: 'Conference souvenir',
      description: 'Commemorative items and conference materials',
      icon: 'gift',
      isHighlighted: false,
      displayOrder: 6
    },
    {
      _type: 'benefit',
      title: 'Abstracts will be published in our refereed journal as a special issue',
      description: 'Your research will be published in our peer-reviewed journal',
      icon: 'certificate',
      isHighlighted: true,
      displayOrder: 7
    },
    {
      _type: 'benefit',
      title: '25% Discount on the manuscript publication fee',
      description: 'Reduced publication costs for conference participants',
      icon: 'star',
      isHighlighted: true,
      displayOrder: 8
    },
    {
      _type: 'benefit',
      title: '5% discount on the Inovineetings Group membership',
      description: 'Special membership pricing for ongoing benefits',
      icon: 'badge',
      isHighlighted: false,
      displayOrder: 9
    },
    {
      _type: 'benefit',
      title: 'Certification by the organizing committee',
      description: 'Official certificate of participation and completion',
      icon: 'certificate',
      isHighlighted: false,
      displayOrder: 10
    }
  ]
};

console.log('Sample Event Schedule Data:');
console.log(JSON.stringify(sampleEventSchedule, null, 2));
console.log('\n\nSample Participation Benefits Data:');
console.log(JSON.stringify(sampleParticipationBenefits, null, 2));

// Instructions for adding to Sanity:
console.log('\n\n=== INSTRUCTIONS ===');
console.log('1. Copy the JSON data above');
console.log('2. Go to your Sanity Studio');
console.log('3. Create new documents of type "Event Schedule" and "Participation Benefits"');
console.log('4. Paste the respective JSON data into each document');
console.log('5. Save the documents');
console.log('6. The sections will now appear on your home page');
