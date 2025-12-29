import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],      // Error rate should be less than 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
};

const BASE_URL = __ENV.URL || 'http://localhost:3000';

export default function () {
  // Test main page
  let response = http.get(BASE_URL, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'k6-performance-test',
    },
  });

  let success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'response contains content': (r) => r.body.includes('Wave'),
  });

  errorRate.add(!success);

  // Test health endpoint
  let healthResponse = http.get(`${BASE_URL}/health`, {
    headers: {
      'Accept': 'text/plain',
    },
  });

  check(healthResponse, {
    'health endpoint status 200': (r) => r.status === 200,
    'health response contains healthy': (r) => r.body.includes('healthy'),
  });

  sleep(1);
}