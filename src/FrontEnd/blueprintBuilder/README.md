you can test just the metadata generation by having a file at output/blueprintBuilderOutput.json and running the following
```bash
node index.js generate
```

Trying to run this locally without docker doesn't work right now, but theoretically you can test it by running fewer blueprints with
```bash
node index.js 2
```

Should probably figure out a way with docker to run both of these, to avoid screwing up the file system too
