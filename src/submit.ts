import querystring from 'querystring';

/**
 * Submit validated & parsed data to SFDC.
 */
export async function submitData(data: TFormData, userData: IUserData): Promise<Response> {
  // Destructure request JSON data & set defaults in case fields are not set.
  const {
    firstName: first_name = '',
    lastName: last_name = '',
    emailAddress: email = '',
    phoneNumber = '',
    interests = [],
    details = '',
    companyName: company = '',
  } = data;

  // Initialize multi-line string for case comments, to which User Data will be added.
  let webFormMetadata = `Interests: ${interests.join(', ')}

  `;

  // Add each User Data key & value to case comment.
  for (let [k, v] of Object.entries(userData)) {
    webFormMetadata += `
    ${k}: ${v}`;
  }

  // Formulate an object conforming with SFDC field requirements.
  let formData: TSFDCRequest = {
    encoding: 'UTF-8',
    oid: SITE_SFDC_ORG_ID,
    first_name,
    last_name,
    company,
    country: userData.Country,
    email,
    lead_source: 'Website',
    description: details,
    ['00N3j00000FccT7']: webFormMetadata,
  };

  // Set the doNotCall property if no phone number is specified.
  if (phoneNumber === '') {
    formData.doNotCall = 1;
  } else {
    formData.phone = phoneNumber;
  }

  // Add debug fields if in development environment.
  if (ENVIRONMENT === 'development') {
    formData = { ...formData, debug: 1, debugEmail: 'matt@stellar.tech' };
  }
  /**
   * Construct the submission URL in query string formatting, to emulate generic HTML form
   * submission.
   */
  const submitUrl = `${SITE_FORM_SUBMIT_URL}?${querystring.stringify(formData)}`;
  return await fetch(submitUrl, { method: 'POST' });
}
