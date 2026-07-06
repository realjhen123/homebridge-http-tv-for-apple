import http from 'node:http';

const BASE_URL = 'http://north.autohome.api.home/tv';

/**
 * Send a GET request to the TV API.
 * All TV API endpoints use GET method with the endpoint path.
 */
function tvRequest(endpoint: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    http.get(url, (res) => {
      // Consume response data to free up memory
      res.resume();
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`TV API returned status ${res.statusCode} for ${endpoint}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`TV API request failed for ${endpoint}: ${err.message}`));
    });
  });
}

/** Power on */
export async function powerOn(): Promise<void> {
  return tvRequest('/on');
}

/** Power off */
export async function powerOff(): Promise<void> {
  return tvRequest('/off');
}

/** Arrow up */
export async function arrowUp(): Promise<void> {
  return tvRequest('/up');
}

/** Arrow down */
export async function arrowDown(): Promise<void> {
  return tvRequest('/down');
}

/** Arrow left */
export async function arrowLeft(): Promise<void> {
  return tvRequest('/left');
}

/** Arrow right */
export async function arrowRight(): Promise<void> {
  return tvRequest('/right');
}

/** Confirm / OK */
export async function confirm(): Promise<void> {
  return tvRequest('/sure');
}

/** Go back */
export async function goBack(): Promise<void> {
  return tvRequest('/back');
}

/** Information key → settings */
export async function information(): Promise<void> {
  return tvRequest('/setting');
}

/** Play/pause → switch */
export async function nextTrack(): Promise<void> {
  return tvRequest('/switch');
}

/** Volume up */
export async function volumeUp(): Promise<void> {
  return tvRequest('/v_up');
}

/** Volume down */
export async function volumeDown(): Promise<void> {
  return tvRequest('/v_down');
}
