// Example function to sanitize and validate the cookie data
export default function validateCookieData(cookieData: string) {
    // Parse the cookie data from JSON
    let parsedData = null;
    try {
      parsedData = JSON.parse(cookieData);
    } catch (e) {
      console.error("Error parsing cookie data:", e);
      return null;
    }
  
    // Check that the UUID is a valid UUIDv4 string
    if (!parsedData.uuid || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(parsedData.uuid)) {
      console.error("Invalid UUID in cookie data:", parsedData.uuid);
      return null;
    }

    return parsedData;
  }