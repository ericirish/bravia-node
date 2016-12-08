# Sony Bravia Node Control

Control your Sony Bravia television with [IFTTT](https://ifttt.com) or with web requests.  Designed with [Google Home](https://madeby.google.com/home/) integration in mind.  

I have this applet running on a Heroku Dyno, which you are free to utilize.

### Compatible TVs

This was tested with my Sony XBR65801C, though it should work with any Sony TV that allows for IP control.  

## Configuration

There are three steps to configuring this to work with your Television:

1. Configuring TV authentication
2. Forward your TV's port so it's externally visible
3. Setting up IFTTT to make a request to the Heroku Dyno

### Setting up your TV's authentication secret

We'll be creating a 'secret' that you will be passing in the web request that will allow the server will send to authenticate itself to your TV.

#### Setting a secret key

On the XBRs with Android TV:

`Home -> Settings -> Network -> Home Network -> IP Control`

Once you're here, make sure **Simple IP Control** is set to *On*.  Next, select **Authentication** and pick **Normal and Pre-Shared Key**.

Next, press BACK and select **Pre-Shared Key**.  Here, enter the 'secret' that you'll be using later.  It doesn't need to be complicated: I used `secret`.

#### Getting your TV's IP address

`Home -> Settings -> Network -> Advanced settings -> Network Status`

Under **IP address setting** look for **IP address**.  It will probably look something like `192.168.1.XXX`.  Hold onto this for the next step.

### Setting up port forwarding

Now, we'll set our TV's port to be externally visible.  This is something that will vary based on your router/internet provider.  I have Google Fiber, and it's [very easy](https://support.google.com/fiber/answer/4643957?hl=en).  Since it's mostly a feature of your router, a Google search with your router's model should yield some results.  We're going for two things here:

* Making your router give your TV a **static IP address**. i.e. the same IP address each time the TV gets a new DHCP lease. This means we can set the port forwarding rule to the IP we got earlier, and it will persist over time.
* Forwarding `port 80` on your TV so that it is externally visible.

### Finding your external IP address

Visit [www.whatsmyip.org](http://www.whatsmyip.org/) on your computer(connected to the same network) to find your network's external IP address.  Save this.

## IFTTT Integration

We'll show an example of how to create an IFTTT Trigger to send a web request to the Heroku Dyno to turn on the TV.  However, this server doesn't have to be used with this specific IFTTT Trigger, or even with IFTTT at all. We'll outline the request object so that anything could trigger the command.

### IFTTT Trigger

1. After you've created an IFTTT account, click **New Applet**.
2. Search for **Google Assistant** and select it.
3. Choose the **"Say a simple phrase"** type.
4. These next four prompts can be whatever you wish them to be.  I used "Turn on my TV" for my trigger phrase. **IMPORTANT NOTICE** I initially tried using proper punctuation with that phrase: "Turn on my TV." However, this did not work with Google Home.  Removing the period got things working as I wanted them to.
5. Click **THAT** and choose **Maker**
6. You'll have one choice here: "Make a web request". Choose it.
7. In the URL enter: `https://bravia-node.herokuapp.com/`
8. *Method:* **POST**
9. *Content Type:* **application/json**
10. *Body:* Here we'll be be entering the details for the web request:

```json
{"action":"on","ip":"XXX.XXX.XXX.XXX","secret":"secret"}
```

Your network's external IP address will go in the `ip` field.  You'll notice that we've set the `action` to `on`. This is where you can put whatever command you wish.  `off` will turn off the TV.  `secret` is the text that you selected to be your authentication secret.

11. **You're all set**. Tell your Google Home "Turn on my TV".  **Note:** that this server is running on a free Heroku Dyno, so there will probably be some lag time between when you say the phrase until the TV turns on.

To set up a command to turn off the TV, you would pass `off` in the `action` field.

## Commands

These commands may vary based on your TV model:

```
Num1
Num2
Num3
Num4
Num5
Num6
Num7
Num8
Num9
Num0
Num11
Num12
Enter
GGuide
ChannelUp
ChannelDown
VolumeUp
VolumeDown
Mute
TvPower
Audio
MediaAudioTrack
Tv
Input
TvInput
TvAntennaCable
WakeUp
PowerOff
Sleep
Right
Left
SleepTimer
Analog2
TvAnalog
Display
Jump
PicOff
PictureOff
Teletext
Video1
Video2
AnalogRgb1
Home
Exit
PictureMode
Confirm
Up
Down
ClosedCaption
Component1
Component2
Wide
EPG
PAP
TenKey
BSCS
Ddata
Stop
Pause
Play
Rewind
Forward
DOT
Rec
Return
Blue
Red
Green
Yellow
SubTitle
CS
BS
Digital
Options
Media
Prev
Next
DpadCenter
CursorUp
CursorDown
CursorLeft
CursorRight
ShopRemoteControlForcedDynamic
FlashPlus
FlashMinus
AudioQualityMode
DemoMode
Analog
Mode3D
DigitalToggle
DemoSurround
*AD
AudioMixUp
AudioMixDown
PhotoFrame
Tv_Radio
SyncMenu
Hdmi1
Hdmi2
Hdmi3
Hdmi4
TopMenu
PopUpMenu
OneTouchTimeRec
OneTouchView
DUX
FootballMode
iManual
Netflix
Assists
ActionMenu
Help
TvSatellite
WirelessSubwoofer
```

## Acknowledgements

This code is based on [Alan Reid's bravia code](https://github.com/alanreid/bravia). Thank you Alan.
