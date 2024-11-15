# Multi-run No Hit Counter

This is a VERY SIMPLE electron app that allows to add a web source to your OBS to display the runs, and a control pannel that allows you to manage the state of the run.

## Usage

You can just download the `.exe` for Windows and use it. The app is not signed. The app requires port 8888 to be available.

You will have to add a web source to OBS with `http://localhost:8888/games`

[How to use (spanish)](https://youtu.be/CBSniJ9szqo)

## Use source code directly

Install [node](https://nodejs.org/en/download/package-manager), then on your shell clone the project, install dependencies and run `npm start`.

```bash
git clone git@github.com:agm-dev/no-hit-multirun.git
cd no-hit-multirun
npm install

npm start

```

You still have to add the `http://localhost:8888/games` source in your OBS.

