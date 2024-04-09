# EASY IP FINDER

This Chrome extension provides a quick and easy way to display your public IP address directly from the browser's toolbar. It's ideal for users who frequently need to check their IP address without having to visit third-party websites.

## Features

- **Easy to Use:** Simply click on the extension icon to see your public IP.
- **Copy IP to clipboard automatically:** Allows copy IP to the clipboard on open the extension popup (this is configurable).
- **Fast and Lightweight:** Utilizes minimal resources, offering quick responses.

## Prerequisites

Before getting started, make sure you have [Node.js](https://nodejs.org/) and npm installed on your system. These tools are necessary for installing dependencies and building the project.

## Installation and Setup

To set up and run the extension on your local environment, follow these steps:

### Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone git@github.com:abisai7/easy-ip-finder.git
cd easy-ip-finder
```

### Install Dependencies

With the repository cloned, install the project dependencies by running:

```bash
npm i
```

### Run in Developer Mode

To start the development server and work on improvements:

```bash
npm run dev
```

### Generate the Build

Once you're ready to build the extension for use:

```bash
npm run build
```

Run in developer mode or generating the build will generate a dist folder containing the local (dev) or production (build) version of the extension.

## Adding the Extension to Chrome

To install and test your extension in Chrome, follow these steps:

1. Open Chrome and navigate to chrome://extensions/.
2. Enable Developer Mode in the top right corner.
3. Click "Load unpacked" and select your project's dist folder.
4. The extension should now appear in your extensions bar. If not, you can find it in the extensions menu and pin it for quick access.

## Usage

To use the extension, simply click on the extension icon in the Chrome toolbar. You will instantly see your current public IP address without the need to visit any website.

## Contributions

If you wish to contribute to this project, your input is welcome! Please send a pull request or open an issue to discuss what you would like to change. :blush:

## Author

Abisai Herrera

- Email: <d_abisai7@outlook.com>
- Website: <https://abisai.dev>

## License

[MIT](https://choosealicense.com/licenses/mit/)
