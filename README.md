# Freelancer Hours

Freelancer Hours is continuous collaboration between you and your clients made easy. No more back and forth proposals and negotations. 

## How it works

1. Use Airtable to create a new client and set your variable/flat rate using JSON (for now)
2. Send over your link with a time recommendation based on the required tasks.
3. Your client requests a top up for the price/time they desire
4. Invoice for the given time
5. Once invoice is paid, get to work and be sure to track your time
6. And... repeat to keep work consistent until the project or the series of tasks is complete.
7. If client requests a timesheet, generate your timesheet for the requested period and email it through.

## Why?

This web tool lets your clients:
- Track their remaining time with you
- Request a top up of time
- Request a timesheet

Benfits for you:
- Work only when your clients have purchased your time
- Variable rates depending on how long you're secured for
- Don't get underpaid for any given piece of work
- Minimise proposals and negotiation

Benefits for your clients:
- Pay as you go model for freelancing
- Don't waste time on proposal reviews
- Maximise time spent on actual business tasks

## Demo

You can find a demo here: https://hours.webdoodle.com.au/buyte/

## Getting Started

Use `.env.example` to create a `.env` file.
Here you can configure your Airtable Settings and provider your public functions/backend URL.

You can find an example Airtable base here: https://airtable.com/shr1N9EQKedRgVSGn

The stack includes: 
- Frontend: React
- Backend: Serverless Node.js (AWS)

### Local Development

Frontend: `yarn start`
Backend: `yarn start:lambda`

### Deployment

For frontend assets we recommend using Netlify as it's a free service, it's highly available, and it leverages GitOps which makes life easy peasy.

For backend: `sls deploy --stage prod` 

... be sure to have Serverless installed
```
npm i -g serverless
```
or
```
yarn global add serverless
```

# Caveats

- Airtable Configuration
  - When setting a client's Link, be sure the pathname is the kebab cased version of the name. This includes whitespace. 
  Name: Hello World 
  Link: https://yourdomain.com/hello-world 
  - When setting your Hours Rates, we recommend using https://jsoneditoronline.org and then pasting back into the cell.