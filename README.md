# rocrail-mqtt-lego-powered-up

An MQTT client for lego poweredup trains. Uses [node-poweredup](https://nathankellenicki.github.io/node-poweredup) train functions. To be used with [rocrail](https://wiki.rocrail.net). Tested with MQTT broker [mosquitto](https://mosquitto.org).

## Rocrail Configuration

Set the locomotive ID to the powered up hub id and port

You can find these by looking at the console output when connecting the hub:

```
Found hub Hubname (id: 90842b0ed660)
Hubname(id: 90842b0ed660) has a trainmotor on port: A
```

Now set your locomotive id to: 90842b0ed660:A

## MQTT Configuration

Set the server host and port in __config.json__

```javascript
{
    "server": {
        "host":"localhost",
        "port": 1883
    }
}
```