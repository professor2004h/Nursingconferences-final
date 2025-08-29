// Country mapping utility for Sanity backend
// Handles conversion between country codes and full names for backward compatibility

// Legacy country code to name mapping for existing data
export const COUNTRY_CODE_MAP: Record<string, string> = {
  'US': 'United States',
  'UK': 'United Kingdom',
  'GB': 'United Kingdom', // ISO standard code
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IN': 'India',
  'CN': 'China',
  'JP': 'Japan',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'ZA': 'South Africa',
  'NG': 'Nigeria',
  'EG': 'Egypt',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'TH': 'Thailand',
  'PH': 'Philippines',
  'ID': 'Indonesia',
  'KR': 'South Korea',
  'OTHER': 'Other',
  
  // Additional common codes
  'AF': 'Afghanistan',
  'AL': 'Albania',
  'DZ': 'Algeria',
  'AD': 'Andorra',
  'AO': 'Angola',
  'AG': 'Antigua and Barbuda',
  'AR': 'Argentina',
  'AM': 'Armenia',
  'AT': 'Austria',
  'AZ': 'Azerbaijan',
  'BS': 'Bahamas',
  'BH': 'Bahrain',
  'BD': 'Bangladesh',
  'BB': 'Barbados',
  'BY': 'Belarus',
  'BE': 'Belgium',
  'BZ': 'Belize',
  'BJ': 'Benin',
  'BT': 'Bhutan',
  'BO': 'Bolivia',
  'BA': 'Bosnia and Herzegovina',
  'BW': 'Botswana',
  'BN': 'Brunei',
  'BG': 'Bulgaria',
  'BF': 'Burkina Faso',
  'BI': 'Burundi',
  'CV': 'Cape Verde',
  'KH': 'Cambodia',
  'CM': 'Cameroon',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'CL': 'Chile',
  'CO': 'Colombia',
  'KM': 'Comoros',
  'CG': 'Congo',
  'CD': 'Congo (Democratic Republic)',
  'CR': 'Costa Rica',
  'CI': 'Côte d\'Ivoire',
  'HR': 'Croatia',
  'CU': 'Cuba',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DK': 'Denmark',
  'DJ': 'Djibouti',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'EC': 'Ecuador',
  'SV': 'El Salvador',
  'GQ': 'Equatorial Guinea',
  'ER': 'Eritrea',
  'EE': 'Estonia',
  'SZ': 'Eswatini',
  'ET': 'Ethiopia',
  'FJ': 'Fiji',
  'FI': 'Finland',
  'GA': 'Gabon',
  'GM': 'Gambia',
  'GE': 'Georgia',
  'GH': 'Ghana',
  'GR': 'Greece',
  'GD': 'Grenada',
  'GT': 'Guatemala',
  'GN': 'Guinea',
  'GW': 'Guinea-Bissau',
  'GY': 'Guyana',
  'HT': 'Haiti',
  'HN': 'Honduras',
  'HU': 'Hungary',
  'IS': 'Iceland',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'IE': 'Ireland',
  'IL': 'Israel',
  'IT': 'Italy',
  'JM': 'Jamaica',
  'JO': 'Jordan',
  'KZ': 'Kazakhstan',
  'KE': 'Kenya',
  'KI': 'Kiribati',
  'KP': 'North Korea',
  'KW': 'Kuwait',
  'KG': 'Kyrgyzstan',
  'LA': 'Laos',
  'LV': 'Latvia',
  'LB': 'Lebanon',
  'LS': 'Lesotho',
  'LR': 'Liberia',
  'LY': 'Libya',
  'LI': 'Liechtenstein',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'MG': 'Madagascar',
  'MW': 'Malawi',
  'MV': 'Maldives',
  'ML': 'Mali',
  'MT': 'Malta',
  'MH': 'Marshall Islands',
  'MR': 'Mauritania',
  'MU': 'Mauritius',
  'FM': 'Micronesia',
  'MD': 'Moldova',
  'MC': 'Monaco',
  'MN': 'Mongolia',
  'ME': 'Montenegro',
  'MA': 'Morocco',
  'MZ': 'Mozambique',
  'MM': 'Myanmar',
  'NA': 'Namibia',
  'NR': 'Nauru',
  'NP': 'Nepal',
  'NL': 'Netherlands',
  'NZ': 'New Zealand',
  'NI': 'Nicaragua',
  'NE': 'Niger',
  'MK': 'North Macedonia',
  'NO': 'Norway',
  'OM': 'Oman',
  'PK': 'Pakistan',
  'PW': 'Palau',
  'PS': 'Palestine',
  'PA': 'Panama',
  'PG': 'Papua New Guinea',
  'PY': 'Paraguay',
  'PE': 'Peru',
  'PL': 'Poland',
  'PT': 'Portugal',
  'QA': 'Qatar',
  'RO': 'Romania',
  'RU': 'Russia',
  'RW': 'Rwanda',
  'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia',
  'VC': 'Saint Vincent and the Grenadines',
  'WS': 'Samoa',
  'SM': 'San Marino',
  'ST': 'São Tomé and Príncipe',
  'SN': 'Senegal',
  'RS': 'Serbia',
  'SC': 'Seychelles',
  'SL': 'Sierra Leone',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'SB': 'Solomon Islands',
  'SO': 'Somalia',
  'SS': 'South Sudan',
  'ES': 'Spain',
  'LK': 'Sri Lanka',
  'SD': 'Sudan',
  'SR': 'Suriname',
  'SE': 'Sweden',
  'CH': 'Switzerland',
  'SY': 'Syria',
  'TW': 'Taiwan',
  'TJ': 'Tajikistan',
  'TZ': 'Tanzania',
  'TL': 'Timor-Leste',
  'TG': 'Togo',
  'TO': 'Tonga',
  'TT': 'Trinidad and Tobago',
  'TN': 'Tunisia',
  'TR': 'Turkey',
  'TM': 'Turkmenistan',
  'TV': 'Tuvalu',
  'UG': 'Uganda',
  'UA': 'Ukraine',
  'UY': 'Uruguay',
  'UZ': 'Uzbekistan',
  'VU': 'Vanuatu',
  'VA': 'Vatican City',
  'VE': 'Venezuela',
  'VN': 'Vietnam',
  'YE': 'Yemen',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe'
};

// List of all valid country names (for validation)
export const VALID_COUNTRY_NAMES: string[] = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'India', 'China', 'Japan', 'Brazil', 'Afghanistan', 'Albania', 'Algeria',
  'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cape Verde',
  'Cambodia', 'Cameroon', 'Central African Republic', 'Chad', 'Chile', 'Colombia',
  'Comoros', 'Congo', 'Congo (Democratic Republic)', 'Costa Rica', 'Côte d\'Ivoire',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'Gabon',
  'Gambia', 'Georgia', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

/**
 * Convert country code to full country name
 */
export const getCountryNameFromCode = (code: string): string => {
  if (!code) return 'Unknown';
  
  // If it's already a full country name, return as is
  if (VALID_COUNTRY_NAMES.includes(code)) {
    return code;
  }
  
  // Convert code to uppercase for consistency
  const upperCode = code.toString().toUpperCase();
  
  // Look up the country name
  return COUNTRY_CODE_MAP[upperCode] || code;
};

/**
 * Normalize country value for display
 * Handles both legacy codes and new full names
 */
export const normalizeCountryForDisplay = (value: string | null | undefined): string => {
  if (!value) return 'India'; // Default to India for missing countries
  
  // If it's already a valid full country name, return as is
  if (VALID_COUNTRY_NAMES.includes(value)) {
    return value;
  }
  
  // Otherwise, treat it as a code and convert
  return getCountryNameFromCode(value);
};

/**
 * Check if a country value is valid
 */
export const isValidCountry = (value: string): boolean => {
  if (!value) return false;
  
  // Check if it's a valid full name
  if (VALID_COUNTRY_NAMES.includes(value)) {
    return true;
  }
  
  // Check if it's a valid code
  const upperCode = value.toString().toUpperCase();
  return COUNTRY_CODE_MAP.hasOwnProperty(upperCode);
};
