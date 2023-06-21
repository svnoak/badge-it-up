# Badge It Up - Gamification Survey Tool

The Badge It Up Survey Tool is a survey software created to track and analyse the effect of badges on respondents.
The survey tool is created to be hosted on Google Cloud Platform for easy deployment and uses only Google Cloud services at the time being.

This survey tool was created for Kim Siebeneicher's and Edit Söderqvist's Bachelor's Thesis "Badge it up - The Effect of Gamification on Online Survey Response"
The thesis analysed the effects of badges on the respondents with the help of this tool.

Badge It Up - Survey tool offers a few key features:

- Is completely respondent for mobile, tablet and desktop usage
- Closely follows Material Design like in Google Forms
- Tracks the respondent through the form
- Enables the respondent to opt-out afterwards
- More to come...

## Table of Contents

- [Installation](#installation)
  - [Create a new project](#create-a-new-project)
  - [Set up Firestore](#set-up-firestore)
  - [Set up PubSub](#set-up-pubsub)
  - [Set up Cloud Functions](#set-up-cloud-functions)
  - [Set up BigQuery](#set-up-bigquery)
  - [Deploy the survey tool](#deploy-the-survey-tool)
- [Modify Badges, texts etc](#modify-badges-texts-etc)
- [Running the survey tool locally](#running-the-survey-tool-locally)
  - [Create a service account](#create-a-service-account)
  - [Create a local environment file](#create-a-local-environment-file)
  - [Install dependencies and run it](#install-dependencies-and-run-it)
- [Todo](#todo)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation

The Survey tool can be hosted on any platform supporting NodeJS.
These steps will only cover Google Cloud Platform and Github, since that it what was used during the bachelor's thesis.
If you need help setting up the project, don't hesitate to message Kim (@svnoak)

Firstly, you need to fork this project (if you do not already have a Github account, create one to be able to fork the project).

Secondly you will need to go to [console.cloud.google.com](Google Cloud Console).

If you do not have a Google Account, create one.

### Create a new project

You need to create a new project to be able to host and use all necessary services.
For this guide we call our project `survey`

For all other steps, you need to make sure you always have "survey" selected as your project

### Set up Firestore

As a database we use Firestore.

1. In the search field at the top, write `firestore` and select the result that says *Firestore*
2. Click on *Select Native Mode*
3. For location, use the location preferred to you. For using the Survey Tool in Europe it is advised to use *eur3* for GDPR reasons
4. Finally click on *Create Database*

Now we need to set up our database with some base collections:

#### **Organiations**

In this step we need to set up our collections properly to be able to load the data into the survey tool as well as save the data from our respondents

1. Click on *START COLLECTION*
2. A sidebar will be made visible where you have multiple fields to fill in.
3. In *Collection ID* write `organisations`
4. Simply click in the field *Document ID* to generate a random DocumentID

5. Create three fields:

    - `name` (type: string) = `Testorganisation` // The name of the organisation
    - `gamified` (type number) = `0` // How many have gotten the gamified survey (updates automatically)
    - `respondents` (type number) = `0` // How many have started the survey in total (updates automatically)

    **THIS DOCUMENT ID IS NEEDED TO ACCESS THE SURVEY LATER ON!**

#### **Respondents**

1. Click on *START COLLECTION*
2. In *Collection ID* write `respondents`
3. Click on *Save*
4. Remove the created document in the collection

The survey tool will take care of creating those documents for us when respondents fill out the survey

#### **Badges**

1. Click on *START COLLECTION*
2. In *Collection ID* write `badges`
3. Simply click int the field *Document ID* to generate a random DocumentID

4. Create the following fields:
    - `index` (type number) // This is the order you want the badges displayed, also will load the corresponding badge image
    - `badge` (type map)

5. In `badge` you create another field called `en` (type map)
6. In `en` you create three fields:
    - `description` (type string) // The requirements to receive the badge
    - `success` (type string) // Successmessage when receiving the badge
    - `title` (type string) // The name of the badge

#### **Questions**

1. Click on *START COLLECTION*
2. In *Collection ID* write `questions`
3. Simply click int the field *Document ID* to generate a random DocumentID

There are five different fields supported in the survey tool: "textfield", "numberfield", "multifield", "time" or "dropdown"

Depending on the field type, your document needs to look a bit different.

```String
field (string): "textfield"
multiline (boolean): true/false // Only needed on textfield if it is a singleline or multiline textfield
position (number): // This is in what order the questions will follow
required (boolean): true/false
section (number) // This indicates the "page" the question will appear on
question (map): "en" (map): description (string), title (string)
```

```String
field (string): "multifield"
amount (number): 3 // How many textfields should be in this textanswer
position (number): // This is in what order the questions will follow
required (boolean): true/false
section (number) // This indicates the "page" the question will appear on
question (map): "en" (map): description (string), title (string)
```

```String
field (string): "dropdown"
position (number): // This is in what order the questions will follow
required (boolean): true/false
section (number) // This indicates the "page" the question will appear on
question (map): "en" (map): description (string), title (string), options (array)
```

```String
field (string): "time" / "numberfield"
position (number): // This is in what order the questions will follow
required (boolean): true/false
section (number) // This indicates the "page" the question will appear on
question (map): "en" (map): description (string), title (string)
```

### Set up PubSub

Next we need to activate Pub/Sub to be able to save our logs to another database

1. We write `pubsub` in the searchfield and click on the first result "Pub/Sub"
2. Click on *Create Topic*
3. Give it a name eg `pubsub`
4. Leave everything else on default and save

### Set up Cloud Functions

Next we need to set up a Cloud Function which will be triggered by Pub/Sub

1. Search for `cloud function` in the searchfield and click on *Cloud Functions*
2. Click on *Create Function*
3. Click on *Enable* in the bottom right corner
4. Change *region* to any region in europe (or whatevery you prefer)
5. At Trigger click on *Edit* and change to "Allow unauthenticated invocations"
6. Click on *save* and then on *next*

Make sure *Runtime* says `Node.js 18`
For *Entrypoint* write `Actions`

Now click on *index.js* and copy the code from this link and insert it into the code field:

<https://gist.github.com/svnoak/baf46fedc507556e78a22e01d995848a>

Click on *package.json* and paste the other part from the gist into the code field.

Then click on *DEPLOY*

### Set up BigQuery

Next we need to set up BigQuery which will keep our logs

1. Search for `BigQuery` in the searchfield and click on "BigQuery"
2. On the left side will be column called *EXPLORER*, click on the three dots right of "survey-123123" (your numbers will be different)
3. Click on *Create data set*
4. Fill out the form like this:

    - Data set ID: `actions`
    - Location type: This you can choose however you like, just keep in mind your local regulations about data storage (eg GDPR, recommended is "Region" and a european country of your chocie)

5. Click on *Create Data Set*
6. Click on the data set we created (`actions`) in the *Explorer* column
7. On the top right, click on *CREATE TABLE*
8. In *Table* write `dev`

9. At Schema, toggle to write as text and insert code from the following gist into the field:

<https://gist.github.com/svnoak/c6c1e6e4f85359fd887c597ec07fe567>

Save the table

Now repeat steps 3 to 8, but instead of writing `dev` at step 8, write `prod` as Table

### Deploy the survey tool

To deploy the tool, we will need to services that will work together: Cloud Build and Cloud Run

Cloud Build will take the code from our github repository and make it possible for Cloud Run to host it.

Cloud Run will then give us a link that we can send to our participants

1. Search for `Cloud Run` in the searchfield and click on *Cloud Run*
2. Click on *Create Service*
3. Change the radiobutton to "Continously deploy new revisions from a source repository"
4. Click on *Set up Cloud build*
5. Choose your Repository Provider (if you simply forked it, use Github)
6. Choose the repository for the survey tool (or click the link underneath the dropdown to allow Google Cloud to find it)
7. Click on Next
8. Keep branch as it is
9. For Build type choose "Dockerfile" and write `/Dockerfile` in Source location
10. Save

11. Now set a service name (eg "survey") and choose a region (as before, be beware of data regulations)
12. Keep everything as it is and set Authentication to "Allow unauthenticated invocations"
13. Click on Create

It will take a little while for Cloud Build and Cloud Run to get everything up and running.

Now we are looking at a sort of dashboard. When everything is done, there should be a large green tick in the left upperhand corner.

Copy the Link (<https://survey-XXXXXXXXasdasd.run.app>) that is in the top

Click on *Edit and Deploy new Revision*
Scroll down to "Environment variables"
And add the following variables:

```STRING
Name 1: TABLE_id
Value 1: prod
Name 2: PROD
Value 2: true
Name 3: SECRET_COOKIE_KEY
Value 3: (write any kind of gibberish you want in this, at least 32 letters)
Name 4: DOMAIN
Value 4: (the domain you just copied, but without https)
```

Scroll all the way down and click on *deploy*

## Modify Badges, texts etc

To be able to modify the survey for your own usage, you will have to modify two things:
The badges (which are CC licensensed and you can use them as is, if you want)
The introtext to get peoples permissions for collecting their data

The consenttext can be changed at `src\pages\[oid]\[lang]\intro.tsx`

The badges (in two different verions) are saved at `public\badges`

The numbers on the badge names are corresponding to the index that we gave them in the Firestore earlier

## Running the survey tool locally

To run the survey tool locally, you will need to follow these setps:

Clone your forked repo (if not already done)

### Create a service account

To have all necessary permissions when running the survey tool, you will need to do the following:

1. Go to [console.cloud.google.com](Google Cloud Console)
2. Search for `IAM` and click on *IAM*
3. On the left side, click on *Service accounts*
4. Click on *CReate service account*
5. Give it some name and add the "Editor" Role and save it
6. In the list click on the three dots for the survey account and click *manage keys*
7. Click on *Add Key*, then *Create new Key*, choose JSON and *Create*
8. Save the file in the same folder as this README.md file

### Create a local environment file

1. Create a .env.local file in your root folder (ie the folder in which this README.md is in)
2. Add this into the .env.local file:

```env
PROD=false
SECRET_COOKIE_KEY=asdsafsdvevscsf23wef23re
GOOGLE_APPLICATION_CREDENTIALS="The absolut path to your serviceAccountKey you downloaded"
TABLE_ID=dev
```

### Install dependencies and run it

Go to the code folder
`cd ./badge-it-up`

Install all dependencies
`npm install`

Run the code
`npm run dev`

You will be able to access the survey only with the link and the organisationID

The organisationID is the Document ID we created in Firestore before

It will look the following:

Locally
`localhost:3000/organisationID`

With url
`https://your-survey-url/organisationID`

If you do not input the organisationID, the survey tool will simply return a 404 page

This was implemented so that we could send the survey to multiple organisations and collect answers on an organisational basis as well as individual basis.

## Todo

- Test that all the steps actually work
- Create templates to easier deploy on GCP
- Document the code

## Contributing

You are very welcome to just fork it and run your own project with it.

If you rather want to extend the already existing base, you are also very welcome to!

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Credits

Lead Developer - Kim Siebeneicher ([@svnoak](https://github.com/svnoak))

Badge design and mechanics - Edit Söderqvist - ([LinkedIn](https://www.linkedin.com/in/editsoderqvist/))

The thesis can be read on [DiVa](https://www.diva-portal.org/smash/record.jsf?pid=diva2:1770142)

## License

The MIT License (MIT)

Copyright (c) 2023 Kim Siebeneicher and Edit Söderqvist

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
