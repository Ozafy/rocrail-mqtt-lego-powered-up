# Rocrail MQTT Client for Lego Powered-up trains

An MQTT client for lego poweredup trains. Uses [node-poweredup](https://nathankellenicki.github.io/node-poweredup) train functions. To be used with [rocrail](https://wiki.rocrail.net). Tested with MQTT broker [mosquitto](https://mosquitto.org).

## Rocrail Configuration

You'll need the powered up hub id and port name.

You can find these by looking at the console output when connecting the hub:

```
Found hub Hubname (id: 90842b0ed660)
Hubname(id: 90842b0ed660) has a trainmotor on port: A
```

Now set your locomotive interface oid to: 90842b0ed660 and your address to 1

Adress translation table:

Port name | Rocrail Address
--- | ---
A | 1
B | 2
A & B | 3

When running A & B together B will run in the reverse direction of A.

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