# Achievements API

## Overview

All user's are referred to by "user references". These can take one of three forms:

- `<uuid>`: each user has a unique UUID, which identifies them uniquely - these
  are created on a user's first login to the system, and stay constant
  throughout the user's lifetime.
- `discord:<str>`: each user can be connected to a discord account. The suffix
  `str` value can either be the user's full username `<username>#<qualifier>`,
  or the user's ID - for development purposes, you should prefer using the ID
  where possible (since it's completely static).
- `twitter:<str>`: each user can be connected to a twitter account. The suffix
  `str` value can either be the user's full username `<display_name>`, or the
  user's ID - again, you should prefer using the full ID where possible.

Achievements can be issued to a user, at any time using any of the above
identifiers. If the user does not currently exist (i.e. they haven't signed in
yet), the achievement is stored later, and resolved when the user correctly
connects one of their accounts.

The achievement `name` is intended to be completely unique - if an achievement
with the same name is issued again, then the old achievement is replaced with
the new one. However, APIs should attempt to avoid issuing multiple duplicate
achievements wherever possible to reduce load on the central system.

## Integration cheatsheet

See <https://api.achieve.localhost/docs> for detailed OpenAPI information, or
<https://admin.achieve.localhost> for the admin panel.

```
POST /users/<userref>/achievements
{
    "name": "<achievement-name>",
    "tags": {}
}
```

`tags` can be any valid JSON object containing string keys.