declare const SITE_FORM_SALES_KEY: string;

declare const SITE_FORM_SUBMIT_URL: string;

declare const SITE_SFDC_ORG_ID: string;

declare const ENVIRONMENT: 'production' | 'development';

type TFormData = {
  // First Name field from web form.
  firstName: string;
  // Last Name field from web form.
  lastName: string;
  // Email Address field from web form.
  emailAddress: string;
  // Phone Number field from web form.
  phoneNumber: string;
  // Company Name field from web form.
  companyName: string;
  // Interests field from web form.
  interests: string[];
  // Details field from web form.
  details: string;
};

interface IUserData {
  // Cloudflare object: country field
  Country: string;
  // Cloudflare object: asn field
  ASN: number;
  // Cloudflare object: colo field
  'Cloudflare Origin': string;
  // Parsed User-Agent browser information, if available
  Browser?: string;
  // Parsed User-Agent device information, if available
  Device?: string;
  // Parsed User-Agent OS information, if available
  OS?: string;
  // Raw User-Agent string, if the above 3 fields are not available/parsable
  'User Agent'?: string;
}

type TSFDCRequest = {
  encoding: 'UTF-8';
  // SFDC Organization ID
  oid: string;
  // Contact First Name
  first_name?: string;
  // Contact Last Name
  last_name?: string;
  // Account Name
  company?: string;
  // Contact Email Address
  email?: string;
  // Contact Phone Number
  phone?: string;
  // Derived country from Cloudflare object
  country?: string;
  // SFDC do not call field
  doNotCall?: 1;
  // SFDC lead source field
  lead_source?: string;
  // Case Subject
  subject?: string;
  // Case Description
  description?: string;
  // Custom field - Web Form Metadata
  '00N3j00000FccT7'?: string;
  // Enable SFDC debugging
  debug?: 1;
  // Email to receive debugging reports
  debugEmail?: string;
};
