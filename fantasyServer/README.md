## Lease Architecture
On the server side, only leases with an isOpen status can be updated, leases with a closed status (manually closed by rentor, lease expired, an ongoing lease) cannot be updated.

An event listening bot runs indefinitely to listen to events emitted from the leasing contract thus update the database by calling the POST /lease endpoint.