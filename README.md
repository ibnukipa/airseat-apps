# AIRSEAT
Mobile platform for check-in seat audiences in a flight using WMA Strategy with rules :
  - Always seat passengers starting from the front row to back, starting from the left to the right
  - Fill Aisle seats first followed by window seats followed by center seats (any order in center seats)

### Techs
AIRSEAT uses a number of open source projects to work properly:
* [ReactJS](https://reactjs.org) - makes it painless to create interactive UIs
* [React Native](https://facebook.github.io/react-native/) -  build mobile apps using only JavaScript
* [Expo](https://expo.io) - provides proccess to handle a variety of use-cases in React Native
* [Lodash](https://lodash.com) - A modern JavaScript utility library delivering modularity, performance & extras.
* [React Navigation](https://reactnavigation.org) - Routing and navigation for React Native apps
* [React Redux](https://redux.js.org) - A predictable state container for JavaScript apps.

### Running from Code
AIRSEAT requires [Node.js](https://nodejs.org/).
Install the dependencies and devDependencies and start Metro Bundler.
```sh
$ cd airplane-seating-algorithm
$ yarn install
$ yarn start
```

### Running from Expo Client
Expo Client allows you to run React Native apps without the code.
1. Download Expo client on App Store / Play Store
2. Open it and search the project named 'AirSeat' by ibnukipa
3. And simply click it and the app will run on your device
