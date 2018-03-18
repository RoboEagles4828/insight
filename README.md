# insight
_Pit display boards and other content for data gathering and scouting during matches_
![Screenshot](https://i.imgur.com/xAev2QK.png)
## Features and objectives
Insight is a RoboEagles side project for displaying competition information in team pits in the FIRST Robotics Competition. It is designed to display only the most essential information to teams in a clearly readable format.

### Design considerations
Insight is designed to operate in an offline environment; wireless communications of any kind in the pit and field areas are technically prohibited by game rules in all recent years. Although the enforcement of this rule is at the discretion of event and pit staff, the decision for Insight to work offline should allow for teams to act in good faith with respect to this rule.

## Components
- HTML files are user-facing views.
  - `upcoming.html` shows only upcoming matches for the day.
  - `scores.html` shows the OPR, ranking, and other information regarding the event. This view requires an internet connection and should not be used pit-side; out-of-date OPR/ranking information (offline) is not particularly useful.
  - `next.html` shows a combined next match and upcoming matches view. This is the recommended all-in-one view at this time.
- `index.js` handles data parsing from a `data.json` file and provides the relevant parsed data to the frontend HTML (which it also serves) via sockets.
- `bluealliancefetch.sh` takes a Blue Alliance event string as an input and outputs JSON, which can be saved to `data.json` and read by Insight.

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
3. Get data from Blue Alliance. Consider doing this step on a computer that has internet access and copying the resulting `data.json` file over.
```
./bluealliancefetch.sh <event_name> > data.json # e.g. ./bluealliancefetch.sh 2018ncgre > data.json
```
4. Launch server
```
npm start
```

The recommended combined next match/upcoming matches view is then visible at `localhost:3000/next.html`.

## Contributing and next steps
- **Improving the front-end.** It looks pretty bare right now, and could use a facelift.
- **Refactoring HTML and scripts.** Right now, they're kind of mashed together. There's probably a better way to separate them to make things easier to maintain.
- **Rewrite to remove `socket.io` dependency.** Most modern browsers (aka not IE) support vanilla WebSockets. It's probably better to use just those and not an additional JS dependency if we can get away with it.
- **Enable config file support.** Right now, team number, port numbers, and other environment variables are hard-coded as constants into scripts. Try storing this data in config files instead to make this code more useable by other teams.
