# PACTOLE

## BACK

### Create conda env for dev
```
conda create --name pactole
conda activate pactole
conda install pip
pip install -r requirements.txt
```

### Launch back via docker:

```
cd back
docker-compose -f app.dev.yml build
docker-compose -f app.dev.yml down
docker-compose -f app.dev.yml up
```

### ou en direct :
```
cd back/app
flask run --debugger
```

### Shutdown back :
```
cd back
docker-compose -f app.dev.yml down
```

### Send request to back :
```
curl -XPOST --header 'Content-Type application/json' 'http://localhost:5000/update' --data-raw '{"ex": "This is an example"}'
```

## FRONT

### Prepare front:
* install nadeJS (https://nodejs.org/fr/)
```
cd front
npm install
```

### Launch front:
```
cd front
npm start
```

