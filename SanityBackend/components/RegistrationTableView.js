import React from 'react'
import { Card, Stack, Text, Flex, Button, Container, Badge } from '@sanity/ui'
import { useClient } from 'sanity'
import './RegistrationTableView.css'

// Theme-aware table view component for registrations
export default function RegistrationTableView() {
  const [registrations, setRegistrations] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('all') // all, pending, completed, failed
  const client = useClient({ apiVersion: '2023-01-01' })

  React.useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const query = `*[_type == "conferenceRegistration"] | order(registrationDate desc) {
        _id,
        registrationId,
        registrationType,
        personalDetails {
          title,
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          fullPostalAddress
        },
        selectedRegistration,
        selectedRegistrationName,
        sponsorType,
        accommodationDetails {
          accommodationType,
          accommodationNights
        },
        accommodationType,
        accommodationNights,
        numberOfParticipants,
        pricing {
          registrationFee,
          accommodationFee,
          totalPrice,
          currency,
          pricingPeriod
        },
        paymentStatus,
        paymentId,
        registrationDate
      }`

      const result = await client.fetch(query)
      setRegistrations(result)
    } catch (err) {
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const filteredData = getFilteredRegistrations()
    
    if (filteredData.length === 0) {
      alert('No data to export')
      return
    }

    const headers = [
      'Registration ID',
      'Name',
      'Email',
      'Phone',
      'Country',
      'Registration Type',
      'Total Price',
      'Currency',
      'Payment Status',
      'Participants',
      'Registration Date',
      'Accommodation',
      'Pricing Period'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredData.map(reg => [
        reg.registrationId || '',
        `"${getFullName(reg)}"`,
        reg.personalDetails?.email || '',
        reg.personalDetails?.phoneNumber || '',
        reg.personalDetails?.country || '',
        getRegistrationTypeName(reg),
        reg.pricing?.totalPrice || 0,
        reg.pricing?.currency || 'USD',
        reg.paymentStatus || 'pending',
        reg.numberOfParticipants || 1,
        reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '',
        getAccommodationInfo(reg),
        reg.pricing?.pricingPeriod || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFullName = (registration) => {
    const { title, firstName, lastName } = registration.personalDetails || {}
    return [title, firstName, lastName].filter(Boolean).join(' ')
  }

  const getRegistrationTypeName = (registration) => {
    // Priority hierarchy for registration type display

    // 1. For sponsorship registrations, show specific tier with "Sponsorship-" prefix
    if (registration.registrationType === 'sponsorship') {
      // Check multiple possible sources for sponsorship tier
      let tierName = null
      
      // From direct sponsorType field (new schema)
      if (registration.sponsorType) {
        tierName = registration.sponsorType
      }
      
      // From sponsorshipDetails reference (old schema)
      if (!tierName && registration.sponsorshipDetails?.sponsorshipTier) {
        const tier = registration.sponsorshipDetails.sponsorshipTier
        tierName = tier.name || tier.displayName || tier.tierName
      }
      
      // From selectedOption field (fallback)
      if (!tierName && registration.selectedOption) {
        tierName = registration.selectedOption
      }
      
      if (tierName) {
        return `Sponsorship-${tierName}`
      }
      
      return 'Sponsorship'
    }

    // 2. Direct stored name (most reliable)
    if (registration.selectedRegistrationName) {
      return registration.selectedRegistrationName
    }

    // 3. Reference lookup name
    if (registration.selectedRegistrationType?.name) {
      return registration.selectedRegistrationType.name
    }

    // 4. Final fallback
    return registration.registrationType === 'regular' ? 'Regular' : 'Unknown'
  }

  const getAccommodationInfo = (registration) => {
    // Check accommodationDetails first (new structure)
    const accDetails = registration.accommodationDetails
    if (accDetails && accDetails.accommodationType) {
      if (typeof accDetails.accommodationType === 'string' && accDetails.accommodationType.includes('-')) {
        const parts = accDetails.accommodationType.split('-')
        const hotelId = parts[0] // First part is hotel ID
        const roomType = parts[1] // Second part is room type
        const nights = accDetails.accommodationNights || parts[2] || 0
        
        // Map hotel ID to hotel name
        const hotelNames = {
          'YaUKtSRJPGGV5DwX1UOi6E': 'Grand Convention Hotel',
          'YaUKtSRJPGGV5DwX1UOiIZ': 'Business Inn & Suites'
        }
        
        const hotelName = hotelNames[hotelId] || 'Unknown Hotel'
        
        const roomTypeDisplay = {
          'single': 'Single Room',
          'double': 'Double Room', 
          'triple': 'Triple Room'
        }[roomType] || roomType
        
        return `${hotelName} - ${roomTypeDisplay} (${nights} nights)`
      } else {
        const nights = accDetails.accommodationNights || 0
        return `${accDetails.accommodationType} (${nights} nights)`
      }
    }

    // Fallback to old structure (accommodationType and accommodationNights at root level)
    if (registration.accommodationType) {
      if (typeof registration.accommodationType === 'string' && registration.accommodationType.includes('-')) {
        const parts = registration.accommodationType.split('-')
        const hotelId = parts[0]
        const roomType = parts[1]
        const nights = registration.accommodationNights || parts[2] || 0
        
        const hotelNames = {
          'YaUKtSRJPGGV5DwX1UOi6E': 'Grand Convention Hotel',
          'YaUKtSRJPGGV5DwX1UOiIZ': 'Business Inn & Suites'
        }
        
        const hotelName = hotelNames[hotelId] || 'Unknown Hotel'
        
        const roomTypeDisplay = {
          'single': 'Single Room',
          'double': 'Double Room', 
          'triple': 'Triple Room'
        }[roomType] || roomType
        
        return `${hotelName} - ${roomTypeDisplay} (${nights} nights)`
      } else {
        const nights = registration.accommodationNights || 0
        return `${registration.accommodationType} (${nights} nights)`
      }
    }

    // Handle accommodationOption format (if exists)
    const accOption = registration.accommodationOption
    if (accOption) {
      const parts = []
      
      if (accOption.hotel?.hotelName) {
        parts.push(accOption.hotel.hotelName)
      }
      
      if (accOption.roomType) {
        const roomTypeDisplay = {
          'single': 'Single Room',
          'double': 'Double Room', 
          'triple': 'Triple Room'
        }[accOption.roomType] || accOption.roomType
        parts.push(roomTypeDisplay)
      }
      
      if (accOption.nights) {
        parts.push(`${accOption.nights} nights`)
      }
      
      if (parts.length > 0) {
        return parts.join(' - ')
      }
    }

    return 'None'
  }

  const getRegistrationPrice = (registration) => {
    // Try to get from pricing object first
    let price = registration.pricing?.registrationPrice
    
    // If not available, try to calculate from other fields
    if (price === undefined || price === null) {
      // Check if we have registrationFee field (from debug data)
      if (registration.pricing?.registrationFee) {
        price = registration.pricing.registrationFee
      } else {
        // For sponsorship registrations, we might need to get the tier price
        if (registration.registrationType === 'sponsorship' && registration.sponsorshipDetails?.sponsorshipTier?.price) {
          price = registration.sponsorshipDetails.sponsorshipTier.price
        } else {
          return 'N/A'
        }
      }
    }
    
    const currency = registration.pricing?.currency || 'USD'
    return `${currency} ${price.toLocaleString()}`
  }

  const getAccommodationPrice = (registration) => {
    // Try to get from pricing object first
    let price = registration.pricing?.accommodationPrice
    
    // If not available, try to calculate from other fields
    if (price === undefined || price === null || price === 0) {
      // Check if we have accommodationFee field (from debug data)
      if (registration.pricing?.accommodationFee) {
        price = registration.pricing.accommodationFee
      } else {
        // Try to calculate from accommodation details and hotel rates
        const accDetails = registration.accommodationDetails
        if (accDetails && accDetails.accommodationType && accDetails.accommodationType.includes('-')) {
          const parts = accDetails.accommodationType.split('-')
          const hotelId = parts[0]
          const roomType = parts[1]
          const nights = parseInt(accDetails.accommodationNights) || 0
          
          // Hotel room rates (from debug data)
          const hotelRates = {
            'YaUKtSRJPGGV5DwX1UOi6E': { // Grand Convention Hotel
              'single': 180,
              'double': 250
            },
            'YaUKtSRJPGGV5DwX1UOiIZ': { // Business Inn & Suites
              'single': 121,
              'double': 160
            }
          }
          
          const ratePerNight = hotelRates[hotelId]?.[roomType]
          if (ratePerNight && nights > 0) {
            price = ratePerNight * nights
          } else {
            return 'N/A'
          }
        } else {
          return 'N/A'
        }
      }
    }
    
    const currency = registration.pricing?.currency || 'USD'
    return `${currency} ${price.toLocaleString()}`
  }

  const getTotalPrice = (registration) => {
    const price = registration.pricing?.totalPrice
    if (price === undefined || price === null) return 'N/A'
    const currency = registration.pricing?.currency || 'USD'
    return `${currency} ${price.toLocaleString()}`
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { tone: 'caution', text: '⏳ Pending' },
      completed: { tone: 'positive', text: '✅ Completed' },
      failed: { tone: 'critical', text: '❌ Failed' },
      refunded: { tone: 'default', text: '🔄 Refunded' }
    }
    
    const config = statusConfig[status] || { tone: 'default', text: '❓ Unknown' }
    return React.createElement(Badge, { tone: config.tone }, config.text)
  }

  const getFilteredRegistrations = () => {
    if (filter === 'all') return registrations
    return registrations.filter(reg => reg.paymentStatus === filter)
  }

  const filteredRegistrations = getFilteredRegistrations()

  if (loading) {
    return React.createElement(Container, { width: 5 },
      React.createElement(Card, { padding: 4 },
        React.createElement(Text, { align: 'center' }, 'Loading registrations...')
      )
    )
  }

  return React.createElement('div', { className: 'registration-table-container' },
    React.createElement(Container, { width: 5 },
      React.createElement(Card, { padding: 4 },
        React.createElement(Stack, { space: 4 },
          // Header with filters
          React.createElement(Flex, { align: 'center', justify: 'space-between' },
            React.createElement(Stack, { space: 2 },
              React.createElement(Text, { size: 4, weight: 'bold' },
                `📝 Conference Registrations (${filteredRegistrations.length})`
              ),
              React.createElement(Flex, { gap: 2 },
                ['all', 'pending', 'completed', 'failed'].map(status =>
                  React.createElement(Button, {
                    key: status,
                    text: status.charAt(0).toUpperCase() + status.slice(1),
                    onClick: () => setFilter(status),
                    mode: filter === status ? 'default' : 'ghost',
                    tone: filter === status ? 'primary' : 'default'
                  })
                )
              )
            ),
            React.createElement(Flex, { gap: 2 },
              React.createElement(Button, {
                text: 'Refresh',
                onClick: fetchRegistrations,
                mode: 'ghost'
              }),
              React.createElement(Button, {
                text: 'Export CSV',
                onClick: exportCSV,
                tone: 'primary',
                disabled: filteredRegistrations.length === 0
              })
            )
          ),
          
          // Table
          filteredRegistrations.length === 0
            ? React.createElement(Card, { padding: 4, tone: 'transparent' },
                React.createElement(Text, { align: 'center', muted: true },
                  filter === 'all' ? 'No registrations yet' : `No ${filter} registrations`
                )
              )
            : React.createElement('div', { className: 'registration-table-wrapper' },
                React.createElement('table', { className: 'registration-table' },
                  React.createElement('thead', null,
                    React.createElement('tr', null,
                      React.createElement('th', null, 'ID'),
                      React.createElement('th', null, 'Name'),
                      React.createElement('th', null, 'Email'),
                      React.createElement('th', null, 'Phone'),
                      React.createElement('th', null, 'Country'),
                      React.createElement('th', null, 'Address'),
                      React.createElement('th', null, 'Type'),
                      React.createElement('th', null, 'Accommodation'),
                      React.createElement('th', null, 'Reg. Price'),
                      React.createElement('th', null, 'Acc. Price'),
                      React.createElement('th', null, 'Total'),
                      React.createElement('th', null, 'Status'),
                      React.createElement('th', null, 'Participants'),
                      React.createElement('th', null, 'Date')
                    )
                  ),
                  React.createElement('tbody', null,
                    filteredRegistrations.map((registration, index) =>
                      React.createElement('tr', { 
                        key: registration._id,
                        className: index % 2 === 0 ? 'even' : 'odd'
                      },
                        React.createElement('td', { className: 'registration-id' }, 
                          registration.registrationId || 'N/A'
                        ),
                        React.createElement('td', { className: 'name' }, 
                          getFullName(registration)
                        ),
                        React.createElement('td', { className: 'email' },
                          registration.personalDetails?.email || 'N/A'
                        ),
                        React.createElement('td', { className: 'phone' },
                          registration.personalDetails?.phoneNumber || 'N/A'
                        ),
                        React.createElement('td', { className: 'country' },
                          registration.personalDetails?.country || 'N/A'
                        ),
                        React.createElement('td', { className: 'address' },
                          registration.personalDetails?.fullPostalAddress || 'N/A'
                        ),
                        React.createElement('td', { className: 'type' },
                          getRegistrationTypeName(registration)
                        ),
                        React.createElement('td', { className: 'accommodation' },
                          getAccommodationInfo(registration)
                        ),
                        React.createElement('td', { className: 'reg-price' },
                          getRegistrationPrice(registration)
                        ),
                        React.createElement('td', { className: 'acc-price' },
                          getAccommodationPrice(registration)
                        ),
                        React.createElement('td', { className: 'total-price' },
                          getTotalPrice(registration)
                        ),
                        React.createElement('td', { className: 'status' },
                          getStatusBadge(registration.paymentStatus)
                        ),
                        React.createElement('td', { className: 'participants' }, 
                          registration.numberOfParticipants || 1
                        ),
                        React.createElement('td', { className: 'date' }, 
                          registration.registrationDate 
                            ? new Date(registration.registrationDate).toLocaleDateString()
                            : 'N/A'
                        )
                      )
                    )
                  )
                )
              )
        )
      )
    )
  )
}
