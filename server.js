// server.js
// Express + Puppeteer app that, on a GET /visit, launches a head‑less Chrome
// and runs a batch of 50 page visits (sequential IPs, random referral & device).

const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------------------------------
// Fake IPs – used sequentially
// -------------------------------------------------
const FAKE_IPS = [
  '203.0.113.45', '198.51.100.12', '192.0.2.78', '172.16.0.5', '10.0.0.9',
  '203.0.113.10', '198.51.100.23', '192.0.2.34', '172.16.0.13', '10.0.0.21'
];
let ipIndex = 0;

// -------------------------------------------------
// Device profiles
// -------------------------------------------------
const DEVICES = {
  android: {
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    viewport: { width: 360, height: 800 }
  },
  ios: {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  },
  desktop: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  }
};

// -------------------------------------------------
// Helper – launch a head‑less browser
// -------------------------------------------------
async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
}

// -------------------------------------------------
// Core automation – one visit
// -------------------------------------------------
async function automate(url, staySeconds = 5, referral = null, device = null) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // ----- referral (random if not supplied) -----
  if (!referral) referral = ['Google', 'Mozilla'][Math.floor(Math.random() * 2)];
  const referralUrls = { Google: 'https:                                                        
  const referer = referralUrls[referral];

                                                
  if (!device) device = Object.keys(DEVICES)[Math.floor(Math.random() * 3)];
  const { userAgent, viewport } = DEVICES[device];
  await page.setUserAgent(userAgent);
  await page.setViewport(viewport);

                              
  const fakeIp = FAKE_IPS[ipIndex];
  ipIndex = (ipIndex + 1) % FAKE_IPS.length;

                                  
  await page.setExtraHTTPHeaders({
    Referer: referer,
    'X-Forwarded-For': fakeIp
  });

                         
  await page.goto(url);
  console.log(`Opened ${url} (referred by ${referral}, IP: ${fakeIp}, device: ${device})`);

                     
  await new Promise(resolve => setTimeout(resolve, staySeconds * 1000));

                        
  await browser.close();
  console.log(`Closed browser after ${staySeconds}s`);
}

                                                    
                                            
                                                    
async function runBatch(url, staySeconds = 5, referral = null, device = null) {
  for (let i = 1; i <= 50; i++) {
    console.log(`--- Batch run ${i}/50 ---`);
    await automate(url, staySeconds, referral, device);
                                         
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

                                                    
                                       
                                                    
app.get('/visit', async (req, res) => {
  const target = 'https://www.effectivegatecpm.com/u97p7p6g?key=fff9d4e49ca6fa8e55790056a72ffac4'; // change if you need a different URL
  // fire‑and‑forget the batch; respond immediately
  runBatch(target, 8).catch(err => console.error(err));
  res.send('Batch of 50 visits scheduled');
});

// -------------------------------------------------
// Start server
// -------------------------------------------------
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
