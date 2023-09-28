# GCP Datastore

GCP Datastore is a library for querying Google Datastore, naturally (default) or through GQL (Google Query Language) or even with GQL Aggregation

## Installation

Use the package manager [npm](https://docs.npmjs.com/about-npm) to install GCP Datastore.

```bash
npm i @N4W-Web-Solutions/gcp-datastore@1.0.0
```

## Usage

```javascript

const gcpDatastore = require("@N4W-Web-Solutions/gcp-datastore")
const gcpDS = new gcpDatastore({projectId: '[PROJECT_ID]', keyFilename: '[/PATH/TO/KEYFILE.json]'})

async function run () {
    const res = await gcpDS.query('[KIND_NAME]', null, null, null, null, 1)
    console.log(res)
}

run()

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
