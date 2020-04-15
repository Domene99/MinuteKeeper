from __future__ import print_function
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import time
from datetime import datetime
import dateparser
import boto3
import json
import time
import pandas as pd
import random

SCOPES = ['https://www.googleapis.com/auth/calendar']

def gcal(text, event_date):
	"""Shows basic usage of the Google Calendar API.
	Prints the start and name of the next 10 events on the user's calendar.
	"""
	creds = None
	# The file token.pickle stores the user's access and refresh tokens, and is
	# created automatically when the authorization flow completes for the first
	# time.
	if os.path.exists('token.pickle'):
		with open('token.pickle', 'rb') as token:
			creds = pickle.load(token)
	# If there are no (valid) credentials available, let the user log in.
	if not creds or not creds.valid:
		if creds and creds.expired and creds.refresh_token:
			creds.refresh(Request())
		else:
			flow = InstalledAppFlow.from_client_secrets_file(
				'credentials.json', SCOPES)
			creds = flow.run_local_server(port=0)
		# Save the credentials for the next run
		with open('token.pickle', 'wb') as token:
			pickle.dump(creds, token)
   
	service = build('calendar', 'v3', credentials=creds)
	date_to_string = str(event_date.year) + '-' + str(event_date.month) + '-' + str(event_date.day) + 'T' + str(event_date.hour) + ':00:00-05:00'
	event = {
		'summary': 'Automatic deadline found by minute keeper',
		'description': text,
		'start': {
			'dateTime': date_to_string,
			'timeZone': 'America/Monterrey',
		},
		'end': {
			'dateTime': date_to_string,
			'timeZone': 'America/Monterrey',
		},
		'reminders': {
			'useDefault': False,
			'overrides': [
				{'method': 'popup', 'minutes': 10},
			],
		},
	}

	event = service.events().insert(calendarId='primary', body=event).execute()
	return event.get('htmlLink')

def dates(text, chunk, lan):
	entities = comprehend.detect_entities(Text = text, LanguageCode = lan)['Entities']
	
	for entity in entities:
		ent_text = entity['Text']
		ent_date = dateparser.parse(ent_text)
		if ent_date is not None and entity['Type'] == "DATE":
			i = entity['BeginOffset']
			j = entity['EndOffset']
			start = text[:i].rfind('.')
			end = text[j:].find('.')
			j = j if end == -1 else j + end + 1
			i = i if end == -1 else start + 1
			if today <= ent_date:
				link = gcal(text[i:j], ent_date)
				data['due'].append({'full_sentence': text[i:j], 'date_keyword': ent_text, 'year': ent_date.year, 'month': ent_date.month, 'day': ent_date.day, 'hour': ent_date.hour, 'chunk': chunk, 'cal_link': link})
			else:
				data['past'].append({'full_sentence': text[i:j], 'date_keyword': ent_text, 'year': ent_date.year, 'month': ent_date.month, 'day': ent_date.day, 'hour': ent_date.hour, 'chunk': chunk})

def keyPhrases(text, chunk, lan):
	key_phrases = comprehend.detect_key_phrases(Text = text, LanguageCode = lan)['KeyPhrases']
	df = pd.DataFrame(key_phrases, columns=['Text'])
	data['key_topics'].append({'most_repeated_key_word': df.Text.value_counts().idxmax(), 'chunk_num': chunk})
	return df.Text.value_counts().idxmax()

def language(text):
	lan = comprehend.detect_dominant_language(Text = text)['Languages'][0]['LanguageCode']
	return lan

def sentiment(text, lan):
	sentiment = comprehend.detect_sentiment(Text = text, LanguageCode = lan)['Sentiment']
	return sentiment

def splitUtf8(s, n):
    while len(s) > n:
        k = n
        while (ord(s[k]) & 0xc0) == 0x80:
            k -= 1
        yield s[:k]
        s = s[k:]
    yield s

with open('script.txt', 'r') as file:
	string = file.read().replace('\n', ' ')

comprehend = boto3.client(service_name = 'comprehend', region_name = 'us-east-2')

today = datetime.now()
text = splitUtf8(string, 4000)
data = {}
data['due'] = []
data['past'] = []
data['key_topics'] = []
data['info'] = []
data['chunks'] = []
j = 0
lan = ""
sentiments = []
topics = []
for s in text:
	if j == 0:
		lan = language(s)
	ch_sentiment = sentiment(s, lan)
	sentiments.append(ch_sentiment)
	dates(s, j, lan)
	topic = keyPhrases(s, j, lan)
	topics.append(topic)
	data['chunks'].append({'chunk_num': j, 'sentiment': ch_sentiment,'text': s, 'size': len(s)})
	j += 1
freq_sent = pd.Series(sentiments).value_counts().idxmax()
freq_topic = pd.Series(topics).value_counts().idxmax()

data['info'].append({'language': lan, 'general_topic': freq_topic, 'morale': freq_sent})

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('Todo-itr7mdmuhzehfe3rmb2eqr2ebq-hackaws')

id = random.randint(9999,999999999)
name = "meeting of: " + today.strftime('%B') + " " + str(today.day) + " " + str(today.year)

table.put_item(
	Item = {
		"id":str(id),
		"name":name,
		"description":"automatic minute from " + name,
		"email":"jabdo89@gmail.com",
		"data":json.dumps(data)
	}
)