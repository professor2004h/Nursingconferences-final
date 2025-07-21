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
          country
        },
        selectedRegistrationType-> {
          name,
          category
        },
        sponsorshipDetails {
          sponsorshipTier-> {
            tierName,
            price
          }
        },
        pricing {
          totalPrice,
          currency,
          pricingPeriod,
          participantCategory
        },
        paymentStatus,
        paymentId,
        registrationDate,
        numberOfParticipants,
        accommodationOption {
          roomType,
          nights
        }
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
    if (registration.registrationType === 'sponsorship') {
      return registration.sponsorshipDetails?.sponsorshipTier?.tierName || 'Sponsorship'
    }
    return registration.selectedRegistrationType?.name || 'Unknown'
  }

  const getAccommodationInfo = (registration) => {
    const acc = registration.accommodationOption
    if (!acc || !acc.roomType) return 'None'
    return `${acc.roomType} (${acc.nights || 0} nights)`
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
                      React.createElement('th', null, 'Country'),
                      React.createElement('th', null, 'Type'),
                      React.createElement('th', null, 'Amount'),
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
                        React.createElement('td', { className: 'country' }, 
                          registration.personalDetails?.country || 'N/A'
                        ),
                        React.createElement('td', { className: 'type' }, 
                          getRegistrationTypeName(registration)
                        ),
                        React.createElement('td', { className: 'amount' }, 
                          `${registration.pricing?.currency || 'USD'} ${registration.pricing?.totalPrice || 0}`
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
