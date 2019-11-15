# CMPT371 Team 2 - Timelines

**Timelines** is an interactive visual environment which helps users view large quantities of temporal data. The tool is to aid a user in distinguishing trends visually, allowing them to select subsets of data to view and analyze through their web-browser.

## Incremental Deliverable 1

For more information about ID1 and the location of its contents, refer to [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID1/documents/ID1).

## Incremental Deliverable 2

For more information about ID2 and the location of its contents, refer to [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID2/documents/ID2).

## Incremental Deliverable 3

For more information about ID4 and the location of its contents, refer to [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID3/documents/ID3).

## Incremental Deliverable 4

For more information about ID4 and the location of its contents, refer to [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID4/documents/ID4). 

## Prototypes

Prototypes can be found in `prototypes/` and a central description of all the prototypes 
along with our results from them can be found in `documents/prototypes.md`

## Installing

In the project directory, you can run:

### `npm install`

Installs all the dependencies to your local machine before starting the application.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint -- --fix`

Run the linter and attempt to fix any issues that it can with the code.

## Electron

It's now possible to build a native application using electron. You should first
ensure you're up to date by running `npm install`.

### Running as a developer

To run the application as a developer with the live reload, run `npm run electron`.

### Creating a production build

To build the react application and package it into native applications for Windows, Linux and MacOS
run `npm package`. 
**Note:** This command will fail on MacOS Catalina, however it will still produce the MacOS application
files. See [this issue](https://github.com/electron-userland/electron-builder/issues/4333) for details, you can use docker as explained [here](https://github.com/electron-userland/electron-builder/issues/4305#issuecomment-541099759) to build for Windows.

You can find the native applications in `dist/`. Some more useful links:

- https://github.com/kitze/react-electron-example
- https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3
- https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/
- https://github.com/electron/electron/issues/9920

### Accessing Electron from React

To access native Electron functions from React you can use the following method:

```javascript
	if (window.isElectron) {
		console.log(window.ipcRenderer);
		window.ipcRenderer.on('pong', (event, arg) => {
			this.setState({ipc: true})
		})
		window.ipcRenderer.send('ping')
	}
```

For access to other aspects of electron, such as the file system, you can use one
of the two methods:

**Edit the preload.js to include the module you need:**

```javascript
const electron = window.require('electron');
window.fs = electron.remote.require('fs');
```

**Include the module in the relevant react component:**

```javascript
const electron = window.require('electron');
const fs = electron.remote.require('fs');
```

#### Example of sending a notification

Due to our preloader, you can directly use HTML5 notifications and they will be
converted to native notifications.

For example,

```javascript
let notif = new Notification("Test", {body: "Hello"})
notif.onclick = () => {
  console.log('Notification clicked')
}
```