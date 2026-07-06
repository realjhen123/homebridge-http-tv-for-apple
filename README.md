# homebridge-http-tv-for-apple
Any http tv and support for iPhone Remote App.
# How to Use?
```
cd /var/lib/homebridge/node_modules
sudo mkdir homebridge-http-tv-for-apple
sudo chown $USER:$USER homebridge-http-tv-for-apple
git clone https://github.com/realjhen123/homebridge-http-tv-for-apple.git
cd homebridge-http-tv-for-apple
npm install
```
## In config
Please Add
```
{
    "platform": "http-tv-for-apple",
    "name": "TV"
}
```
On Json -> "platforms" -> []. <br>
/var/lib/homebridge/config.json or using webside.

```
sudo systemctl restart homebridge
```
or http://ip:8581/restart