# insight
_Pit display boards and other content for data gathering and scouting during matches_
![Screenshot](https://i.imgur.com/jgJFAjy.png)
## Features and objectives
Insight is a RoboEagles side project for displaying competition information in team pits in the FIRST Robotics Competition. It is designed to display only the most essential information to teams in a clearly readable format.

### Design considerations
Insight is designed to operate in an offline environment; wireless communications of any kind in the pit and field areas are technically prohibited by game rules in all recent years. Although the enforcement of this rule is at the discretion of event and pit staff, the decision for Insight to work offline should allow for teams to act in good faith with respect to this rule.

## Components
- ejs files are complete (`page`) or `partial` pieces of user-facing views, which the application renders and populates with data on request.
- `index.js` handles data parsing from a `data.json` file and renders the provided ejs templates with the necessary data
- `bluealliancefetch.sh` takes a Blue Alliance event key as an input and outputs JSON, which can be saved to `data.json` and read by Insight.

## Installation

### Dependencies
- [node.js](https://nodejs.org), which runs the backend data processing/page serving core
- [jq](https://stedolan.github.io/jq), which `bluealliancefetch.sh` uses to parse API output from Blue Alliance

### Project setup
1. Clone this repository and enter it.
```
git clone https://github.com/RoboEagles4828/insight && cd insight
```
2. Install necessary dependencies.
  - With `npm`...
  ```
  npm install
  ```
  - or with `yarn`
  ```
  npm install -g yarn # if not already installed
  yarn install
  ```
3. Get data from Blue Alliance. Consider doing this step on a computer that has internet access and copying the resulting `data.json` file over. Note that with the move to the new Blue Alliance v3 API, an API key (free) must be obtained from Blue Alliance. If you need an API key, log into your TBA account and generate a new key in the account settings.
```
./bluealliancefetch.sh [event_name] [api_key] > data.json # e.g. ./bluealliancefetch.sh 2018ncgre > data.json
```
4. Launch server
```
npm start
```

The recommended combined next match/upcoming matches view is then visible at `localhost:3000`.

## Contributing and next steps
- **Enable config file support.** Right now, team number, port numbers, and other environment variables are hard-coded as constants into scripts. Try storing this data in config files instead to make this code more useable by other teams.
- **Make data refresh live.** Previously, this was accomplished with some really clunky client-side code. Look into more streamlined mechanisms to update data in the page (or maybe just refresh the whole page altogether).
