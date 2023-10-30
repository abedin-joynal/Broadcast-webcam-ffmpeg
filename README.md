# Broadcast PC Webcam Feed
This project allows to remotely control one or many android devices and broadcasts webcam feed to the browser using adb, ffmpeg, node.js, socket.io and express. 

# System Requirements
- FFMPEG version 4.
- Node js version 8.15.1

# Hardware Requirements
- Webcam
- Android device

# Installation 

# FFMPEG Installation: 
$ sudo add-apt-repository ppa:jonathonf/ffmpeg-4
$ sudo apt-get update
$ sudo apt-get install ffmpeg

After successfully install FFmpeg, let’s check the version installed on the system.
$ ffmpeg -version

# Install NodeJs
$ sudo apt-get install curl
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ node -v

if you get error, node is not installed, then
$ ln -s /usr/bin/nodejs /usr/bin/node

# Install NPM
$ sudo apt-get install npm
$ sudo npm install npm --global
$ npm -v

# Install ADB
$ sudo apt-get install android-tools-adb

# Deployment
- Connect a webcam.
- Connect one or multiple android device.

Then,
$ cd client_dev
$ npm install
$ node streamserver.js

Open your browser to localhost:5000

