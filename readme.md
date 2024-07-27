# RateLimiter

A simple and efficient rate limiter for controlling the rate of function executions, designed for ease of use and high performance.

## Installation

To install the RateLimiter package, run the following command:

```bash
npm install --save rate-limiter-pro
```
## Usage
1.Include rate limiter from package.
```
import rateLimiter from 'rateLimiter'
```
2.Create an instance of RateLimiter and use it as middleware:
```
// Define rate limiter with expiry time in seconds and request limit
const limiter = new RateLimiter(expiresIn: number,count: number);
```
3.use it in accordance to the need.
```
  if (limiter.checkLimit(req.ip)) { // can use any unique key
    // Allow request
  } else {
    // Reject request
  }
```

## Example
```
import express from 'express';
import RateLimiter from 'rateLimiter';

const app = express();
const limiter = new RateLimiter(60, 10); // 60 seconds, 10 requests

app.use(express.json());

app.use((req, res, next) => {
  if (limiter.checkLimit(req.ip)) {
    next(); // Allow request
  } else {
    res.status(429).send('Too many requests');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

```