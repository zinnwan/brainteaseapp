<!-- ![Brain Tease logo](frontend_bt/braintease/public/favicon/android-chrome-512x512.png)
# Brain Tease -->

<div align="center">
    <img src="frontend_bt/braintease/public/favicon/android-chrome-192x192.png" alt="Brain Tease logo" />
    <h1>Brain Tease</h1>
</div>

### Description:
This project is a flashcards web application. The user can create
a deck, give a title, description and a cover. Then  cards will
be added after. Each card has a front side, back side, and a title.
The user can choose a deck, and start a session. A session has three
rounds, in which the user see the front of the card, then flips it.
Then they can either put the card aside, or to then next round. 
Upon finishing the session, a table containing the time taken to flip
each card, in each round is shown.

### Framework:
**Backend**: Python --> Django
![Python Django logo](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)

**API**: Django Rest Framework
![Django Rest Framework logo](https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white)

**Frontend**: Javascript --> React
![Javascript React logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Samples:
<div display="flex">
    <img src="./samples/Screenshot%20from%202023-05-11%2023-51-51.png" alt="sample 0: homepage" height="600"/>
    <img src="./samples/braintease_sample_1.gif" alt="sample 1: create page" width="500"/>
    <img src="./samples/braintease_sample_2.gif" alt="sample 2: session page" width="500"/>
</div>

### Instructions:
The project is not live at the moment, if you want to check it out
follow the instructions below.
1. You have to have: Python(3), NodeJs, a Terminal.
2. Clone the project
```bash
git clone https://github.com/zinnwan/brainteaseapp.git
```
or 
```bash
gh repo clone zinnwan/brainteaseapp
```
3. Go to the project directory:
```bash
cd brainteaseapp
```
4. Open a second terminal or tab in the same current directory.
5. In the first terminal/tab go to backend_bt directory:
```bash 
cd backend_bt
```
activate the virtual environment:
```bash 
source bt_env/bin/activate
``` 
install required packages:
```bash 
pip install -r requirements.txt
```
and run the server: 
```bash 
python manage.py runserver
```
6. In the second terminal/tab go to frontend_bt:
```bash 
cd frontend_bt/braintease
```
install required packages:
```bash 
npm install
```
start react environment:
```bash 
npm start
```
