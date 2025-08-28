import React from 'react'
import { Card, Stack, Text, Flex, Button, Container, Badge, TextInput, Select, Grid, Box } from '@sanity/ui'
import { SearchIcon, DownloadIcon, FilterIcon, DocumentPdfIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import './RegistrationTableView.css'

// Enhanced registration management table with filtering, sorting, and PDF downloads
export default function RegistrationTableView() {
  const [registrations, setRegistrations] = React.useState([])
  const [filteredRegistrations, setFilteredRegistrations] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' })
  const [sortField, setSortField] = React.useState('registrationDate')
  const [sortDirection, setSortDirection] = React.useState('desc')
  const client = useClient({ apiVersion: '2023-05-03' })

  React.useEffect(() => {
    fetchRegistrations()
  }, [])

  // Filter and search functionality
  React.useEffect(() => {
    let filtered = [...registrations]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reg => {
        const searchText = [
          reg.personalDetails?.firstName,
          reg.personalDetails?.lastName,
          reg.personalDetails?.email,
          reg.personalDetails?.phoneNumber,
          reg.paypalTransactionId,
          reg.registrationId
        ].join(' ').toLowerCase()
        return searchText.includes(searchTerm.toLowerCase())
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => {
        if (statusFilter === 'successful') return reg.paymentStatus === 'completed'
        return reg.paymentStatus === statusFilter
      })
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(reg => reg.registrationType === typeFilter)
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(reg => {
        const regDate = new Date(reg.registrationDate)
        const startDate = dateRange.start ? new Date(dateRange.start) : null
        const endDate = dateRange.end ? new Date(dateRange.end) : null

        if (startDate && regDate < startDate) return false
        if (endDate && regDate > endDate) return false
        return true
      })
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField.includes('.')) {
        const keys = sortField.split('.')
        aValue = keys.reduce((obj, key) => obj?.[key], a)
        bValue = keys.reduce((obj, key) => obj?.[key], b)
      }

      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, statusFilter, typeFilter, dateRange, sortField, sortDirection])

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
        sponsorType,
        numberOfParticipants,
        pricing {
          registrationFee,
          accommodationFee,
          totalPrice,
          currency,
          pricingPeriod
        },
        paymentStatus,
        paypalTransactionId,
        paypalOrderId,
        paymentMethod,
        paymentDate,
        registrationDate,
        pdfReceipt {
          asset-> {
            _id,
            url,
            originalFilename
          }
        },
        registrationTable {
          paypalTransactionId,
          registrationType,
          participantName,
          phoneNumber,
          emailAddress,
          paymentAmount,
          currency,
          paymentStatus,
          registrationDate,
          pdfReceiptFile {
            asset-> {
              _id,
              url,
              originalFilename
            }
          }
        }
      }`

      const result = await client.fetch(query)
      setRegistrations(result)
      setFilteredRegistrations(result)
    } catch (err) {
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No data to export')
      return
    }

    const headers = [
      'PayPal Transaction ID',
      'Registration Type',
      'Participant Name',
      'Phone Number',
      'Email Address',
      'Payment Amount',
      'Currency',
      'Payment Status',
      'Registration Date',
      'PDF Receipt Available'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.paypalTransactionId || 'N/A',
        reg.registrationType || 'N/A',
        `"${getFullName(reg)}"`,
        reg.personalDetails?.phoneNumber || 'N/A',
        reg.personalDetails?.email || 'N/A',
        reg.pricing?.totalPrice || 0,
        reg.pricing?.currency || 'USD',
        reg.paymentStatus === 'completed' ? 'Successful' : (reg.paymentStatus || 'Pending'),
        reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'N/A',
        (reg.pdfReceipt?.asset?.url || reg.registrationTable?.pdfReceiptFile?.asset?.url) ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registration_table_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadPDF = (registration) => {
    const pdfUrl = registration.pdfReceipt?.asset?.url || registration.registrationTable?.pdfReceiptFile?.asset?.url
    if (pdfUrl) {
      const fileName = `receipt_${registration.paypalTransactionId || registration.registrationId}.pdf`

      // Create link with new tab target
      const link = document.createElement('a')
      link.href = pdfUrl
      link.target = '_blank'  // Force new tab
      link.rel = 'noopener noreferrer'  // Security
      link.download = fileName

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('PDF receipt not available for this registration')
    }
  }

  const downloadAllPDFs = async () => {
    const registrationsWithPDF = filteredRegistrations.filter(reg =>
      reg.pdfReceipt?.asset?.url || reg.registrationTable?.pdfReceiptFile?.asset?.url
    )

    if (registrationsWithPDF.length === 0) {
      alert('No PDF receipts available for download')
      return
    }

    // Download each PDF with a small delay to avoid overwhelming the browser
    for (let i = 0; i < registrationsWithPDF.length; i++) {
      setTimeout(() => {
        downloadPDF(registrationsWithPDF[i])
      }, i * 500) // 500ms delay between downloads
    }
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
      completed: { tone: 'positive', text: '✅ Successful' },
      failed: { tone: 'critical', text: '❌ Failed' },
      refunded: { tone: 'default', text: '🔄 Refunded' }
    }

    const config = statusConfig[status] || { tone: 'default', text: '❓ Unknown' }
    return React.createElement(Badge, { tone: config.tone }, config.text)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Remove old filtering logic as it's now handled in useEffect

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
          // Header
          React.createElement(Text, { size: 4, weight: 'bold' },
            `📊 Registration Management Table (${filteredRegistrations.length})`
          ),

          // Filters and Search
          React.createElement(Grid, { columns: [1, 2, 3], gap: 3 },
            React.createElement(TextInput, {
              icon: SearchIcon,
              placeholder: 'Search by name, email, transaction ID...',
              value: searchTerm,
              onChange: (event) => setSearchTerm(event.currentTarget.value)
            }),
            React.createElement(Select, {
              value: statusFilter,
              onChange: (event) => setStatusFilter(event.currentTarget.value)
            },
              React.createElement('option', { value: 'all' }, 'All Status'),
              React.createElement('option', { value: 'pending' }, 'Pending'),
              React.createElement('option', { value: 'successful' }, 'Successful'),
              React.createElement('option', { value: 'failed' }, 'Failed')
            ),
            React.createElement(Select, {
              value: typeFilter,
              onChange: (event) => setTypeFilter(event.currentTarget.value)
            },
              React.createElement('option', { value: 'all' }, 'All Types'),
              React.createElement('option', { value: 'regular' }, 'Regular'),
              React.createElement('option', { value: 'sponsorship' }, 'Sponsorship')
            )
          ),

          // Date Range Filter
          React.createElement(Flex, { gap: 2, align: 'center' },
            React.createElement(Text, { size: 1 }, 'Date Range:'),
            React.createElement('input', {
              type: 'date',
              value: dateRange.start,
              onChange: (e) => setDateRange(prev => ({ ...prev, start: e.target.value })),
              style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
            }),
            React.createElement(Text, { size: 1 }, 'to'),
            React.createElement('input', {
              type: 'date',
              value: dateRange.end,
              onChange: (e) => setDateRange(prev => ({ ...prev, end: e.target.value })),
              style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
            }),
            React.createElement(Button, {
              text: 'Clear',
              mode: 'ghost',
              onClick: () => setDateRange({ start: '', end: '' })
            })
          ),

          // Action Buttons
          React.createElement(Flex, { gap: 2, justify: 'flex-end' },
            React.createElement(Button, {
              text: 'Refresh',
              onClick: fetchRegistrations,
              mode: 'ghost'
            }),
            React.createElement(Button, {
              text: 'Export CSV',
              icon: DownloadIcon,
              onClick: exportCSV,
              tone: 'primary',
              disabled: filteredRegistrations.length === 0
            }),
            React.createElement(Button, {
              text: 'Download All PDFs',
              icon: DocumentPdfIcon,
              onClick: downloadAllPDFs,
              tone: 'positive',
              disabled: filteredRegistrations.filter(reg =>
                reg.pdfReceipt?.asset?.url || reg.registrationTable?.pdfReceiptFile?.asset?.url
              ).length === 0
            })
          ),
          
          // Registration Management Table
          filteredRegistrations.length === 0
            ? React.createElement(Card, { padding: 4, tone: 'transparent' },
                React.createElement(Text, { align: 'center', muted: true },
                  'No registrations found matching the current filters'
                )
              )
            : React.createElement('div', { className: 'registration-table-wrapper' },
                React.createElement('table', { className: 'registration-table' },
                  React.createElement('thead', null,
                    React.createElement('tr', null,
                      React.createElement('th', {
                        onClick: () => handleSort('paypalTransactionId'),
                        style: { cursor: 'pointer' }
                      }, 'PayPal Transaction ID'),
                      React.createElement('th', {
                        onClick: () => handleSort('registrationType'),
                        style: { cursor: 'pointer' }
                      }, 'Registration Type'),
                      React.createElement('th', {
                        onClick: () => handleSort('personalDetails.firstName'),
                        style: { cursor: 'pointer' }
                      }, 'Participant Name'),
                      React.createElement('th', null, 'Phone Number'),
                      React.createElement('th', {
                        onClick: () => handleSort('personalDetails.email'),
                        style: { cursor: 'pointer' }
                      }, 'Email Address'),
                      React.createElement('th', {
                        onClick: () => handleSort('pricing.totalPrice'),
                        style: { cursor: 'pointer' }
                      }, 'Payment Amount'),
                      React.createElement('th', null, 'Currency'),
                      React.createElement('th', {
                        onClick: () => handleSort('paymentStatus'),
                        style: { cursor: 'pointer' }
                      }, 'Payment Status'),
                      React.createElement('th', {
                        onClick: () => handleSort('registrationDate'),
                        style: { cursor: 'pointer' }
                      }, 'Registration Date'),
                      React.createElement('th', null, 'PDF Receipt')
                    )
                  ),
                  React.createElement('tbody', null,
                    filteredRegistrations.map((registration, index) =>
                      React.createElement('tr', {
                        key: registration._id,
                        className: index % 2 === 0 ? 'even' : 'odd'
                      },
                        React.createElement('td', { className: 'transaction-id' },
                          registration.paypalTransactionId || 'N/A'
                        ),
                        React.createElement('td', { className: 'type' },
                          registration.registrationType || 'N/A'
                        ),
                        React.createElement('td', { className: 'name' },
                          getFullName(registration)
                        ),
                        React.createElement('td', { className: 'phone' },
                          registration.personalDetails?.phoneNumber || 'N/A'
                        ),
                        React.createElement('td', { className: 'email' },
                          registration.personalDetails?.email || 'N/A'
                        ),
                        React.createElement('td', { className: 'amount' },
                          registration.pricing?.totalPrice || 0
                        ),
                        React.createElement('td', { className: 'currency' },
                          registration.pricing?.currency || 'USD'
                        ),
                        React.createElement('td', { className: 'status' },
                          getStatusBadge(registration.paymentStatus)
                        ),
                        React.createElement('td', { className: 'date' },
                          registration.registrationDate
                            ? new Date(registration.registrationDate).toLocaleDateString()
                            : 'N/A'
                        ),
                        React.createElement('td', { className: 'pdf-receipt' },
                          (registration.pdfReceipt?.asset?.url || registration.registrationTable?.pdfReceiptFile?.asset?.url)
                            ? React.createElement(Button, {
                                text: 'Download',
                                icon: DocumentPdfIcon,
                                mode: 'ghost',
                                tone: 'positive',
                                onClick: () => downloadPDF(registration),
                                fontSize: 1,
                                className: 'pdf-download-btn',
                                title: 'Download PDF receipt (opens in new tab)'
                              })
                            : React.createElement(Text, { size: 1, muted: true }, 'Not Available')
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
