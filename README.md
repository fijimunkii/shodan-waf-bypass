# Shodan WAF Bypass

[![License: ISC](https://img.shields.io/npm/l/shodan-waf-bypass.svg)](https://opensource.org/licenses/ISC)

Firewall bypass script based on shodan search results. This script will enumerate IP addresses and check if the server replies for a given host. Returns an array of vulnerable IP addresses.
Handy for bugbounty hunters.

Requires a shodan API key and an html snippet to validate the results.

## How to protect against this script?

If you are behind a firewall, whitelist connections coming from the firewall and deny all other traffic.

TODO:
- find a good public website this works for
- add tests
