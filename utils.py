import time
from datetime import datetime
import dateparser
import boto3
import json
import time
import pandas as pd

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
			j = j if end == -1 else j + end
			i = i if end == -1 else start
			data['due' if today <= ent_date else 'past'].append({'full_sentence': text[i:j], 'date_keyword': ent_text, 'year': ent_date.year, 'month': ent_date.month, 'day': ent_date.day, 'hour': ent_date.hour, 'chunk': chunk})

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

print (json.dumps(data, sort_keys = True, indent = 4))

with open('data.txt', 'w') as outfile:
    json.dump(data, outfile)
