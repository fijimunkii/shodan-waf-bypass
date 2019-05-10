const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));
const userAgent = require('real-user-agent');
const client = require('shodan-client');
const searchOpts = { minify: true };

async function headers(host) {
  return {
    'Host':`${host}`,
    'Authority':`${host}`,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': await userAgent(),
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  };
};

module.exports = async (options) => {
  options = options || {};
  if (!options.host) throw 'Missing host';
  if (!options.shodanKey) throw 'Missing shodan key';
  if (!options.testString) throw 'Missing test string';

  const ipaddresses = await client
    .search(`${options.host}${options.filters?' '+options.filters:''}`, options.shodanKey, searchOpts)
    .then(res => {
      return res.matches
        .filter(d => d.http && d.http.html && d.http.html.includes(options.testString))
        .map(d => d.ip_str);
    });

  let results = await Promise.all(ipaddresses.map(async ip => request.getAsync({
      rejectUnauthorized: false,
      timeout: 1000,
      url: `https://${ip}${options.path||''}`,
      headers: options.headers || await headers(host)
    })
    .then(d => {
      if (d.body.includes(options.testString)) {
        return ip;
      }
    })
    .catch(() => { })));

  results = results.filter(d => d);
  if (!results.length) {
    throw 'No results';
  }

  return results;
};
