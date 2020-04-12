import boto3
import json
import time
import pandas as pd
start_time = time.time()

def dates(text):
	entities = comprehend.detect_entities(Text = text, LanguageCode = 'en')['Entities']
	
	for entity in entities:
		if(entity['Type'] == 'DATE'):
			print ("\t" + entity['Text'])

def keyPhrases(text):
	print("------------------------------------------------------------------------------------------------")
	key_phrases = comprehend.detect_key_phrases(Text=text, LanguageCode='en')['KeyPhrases']
	highest = 0
	kp_text = ""
	df = pd.DataFrame(key_phrases, columns=['Text'])
	print (df.Text.value_counts().idxmax())

def split_utf8(s, n):
    while len(s) > n:
        k = n
        while (ord(s[k]) & 0xc0) == 0x80:
            k -= 1
        yield s[:k]
        s = s[k:]
    yield s
 
with open('bee.txt', 'r') as file:
	data = file.read().replace('\n', '')

string = split_utf8(data, 3000)

comprehend = boto3.client(service_name = 'comprehend', region_name = 'us-east-2')

print("fechas:")
for s in string:
	dates (s)
print("--- %s seconds ---" % (time.time() - start_time))
